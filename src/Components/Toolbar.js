import React, { useState, useEffect } from "react";
import { useGoogleDrive } from "../context/useGoogleDrive";
import "../styles/variables.css";
import "../styles/toolbar.css";

const Toolbar = () => {
    const driveState = useGoogleDrive(); // Directly consume the context
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setIsVisible(e.clientY < 100); // Show toolbar when mouse is near the top of the screen
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    useEffect(() => {
        if (driveState?.authenticate) {
            console.log("Automatically authenticating Google Drive...");
            driveState.authenticate(); // Automatically trigger authentication on load
        } else {
            console.error("Authentication method is not available.");
        }
    }, [driveState]);

    const handleNewProject = async () => {
        if (!driveState?.initialized) {
            console.error("Google Drive is not initialized. Cannot create a new project.");
            alert("Google Drive is not initialized. Please authenticate first.");
            return;
        }

        // Show native browser popup to collect project name
        const projectName = window.prompt("Enter the project name:", "");

        // Validate user input
        if (!projectName) {
            console.error("Project creation cancelled or invalid input.");
            return; // User cancelled or entered an invalid name
        }

        try {
            console.log(`Creating a new project: "${projectName}"`);
            await driveState.createProjectHierarchy(projectName);
            console.log(`Project "${projectName}" created successfully!`);
        } catch (error) {
            console.error(`Error creating the project "${projectName}":`, error);
        }
    };

    const handleLoad = () => {
        console.log("Load button clicked. Functionality coming soon...");
    };

    const handleSave = () => {
        console.log("Save button clicked. Functionality coming soon...");
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
                    onClick={handleNewProject}
                    disabled={!driveState?.initialized} // Disable if not initialized
                >
                    New
                </button>
                <button
                    className="toolbar-button"
                    onClick={handleLoad}
                >
                    Load
                </button>
                <button
                    className="toolbar-button"
                    onClick={handleSave}
                >
                    Save
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
