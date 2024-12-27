import React, { useState, useEffect } from "react";
import { useGoogleDrive } from "../context/useGoogleDrive";
import "../styles/variables.css";
import "../styles/toolbar.css";

const Toolbar = () => {
    const driveState = useGoogleDrive(); // Directly consume the context
    const [isVisible, setIsVisible] = useState(true);
    const [projectName, setProjectName] = useState(""); // State for the project name

    useEffect(() => {
        const handleMouseMove = (e) => {
            setIsVisible(e.clientY < 100); // Show toolbar when mouse is near the top of the screen
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const handleNewProject = async () => {
        console.log(`Button clicked: Create Project - "${projectName}"`);
        if (!driveState?.initialized) {
            console.error("Google Drive is not initialized. Cannot create a new project.");
            return;
        }
        if (!projectName.trim()) {
            console.error("Project name is required.");
            alert("Please enter a project name.");
            return;
        }
        try {
            console.log(`Creating a new project: "${projectName}"`);
            await driveState.createProjectHierarchy(projectName);
            console.log(`Project "${projectName}" created successfully!`);
            setProjectName(""); // Clear the input after successful creation
        } catch (error) {
            console.error(`Error creating the project "${projectName}":`, error);
        }
    };

    const handleAuthenticate = () => {
        console.log("Button clicked: Authenticate");
        if (driveState?.authenticate) {
            console.log("Redirecting to Google OAuth...");
            driveState.authenticate(); // Redirect to Google OAuth
        } else {
            console.error("Authentication method not available.");
        }
    };

    if (!driveState || !driveState.authenticate) {
        console.log("Toolbar is waiting for Google Drive to initialize...");
        return (
            <div className="toolbar">
                <div className="toolbar-loading">
                    Initializing Google Drive... Please wait.
                </div>
            </div>
        );
    }

    return (
        <div className={`toolbar ${isVisible ? "visible" : ""}`}>
            <div className="toolbar-left">
                <button
                    className="toolbar-button"
                    onClick={handleAuthenticate}
                >
                    Authenticate Google Drive
                </button>
                <input
                    type="text"
                    className="toolbar-input"
                    placeholder="Enter project name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)} // Update project name state
                />
                <button
                    className="toolbar-button"
                    onClick={handleNewProject}
                    disabled={!driveState?.initialized || !projectName.trim()} // Disable if not initialized or empty name
                >
                    Create Project
                </button>
            </div>
            <div className="toolbar-right">
                <span className="connection-status">
                    {driveState?.initialized ? "● Online" : "○ Offline"}
                </span>
            </div>
        </div>
    );
};

export default Toolbar;
