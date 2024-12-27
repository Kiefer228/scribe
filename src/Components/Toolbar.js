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

    const handleNewProject = async () => {
        console.log("Button clicked: New Project");
        if (!driveState?.initialized) {
            console.error("Google Drive is not initialized. Cannot create a new project.");
            return;
        }
        try {
            console.log("Creating a new project...");
            await driveState.createProjectHierarchy("New Project");
            console.log("New project created successfully!");
        } catch (error) {
            console.error("Error creating a new project:", error);
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
                <button
                    className="toolbar-button"
                    onClick={handleNewProject}
                    disabled={!driveState?.initialized} // Disable if not initialized
                >
                    New Project
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
