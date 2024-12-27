import React, { useState, useEffect } from "react";
import { useGoogleDrive } from "../context/useGoogleDrive";
import "../styles/variables.css";
import "../styles/toolbar.css";

const Toolbar = () => {
    const { driveState } = useGoogleDrive() || { initialized: false, authenticate: null }; // Fallback for undefined state
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setIsVisible(e.clientY < 100); // Show toolbar when mouse is near the top of the screen
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const handleNewProject = async () => {
        console.log("Button clicked. New project handler fired.");
        if (!driveState?.initialized) {
            console.error("Google Drive is not initialized. Cannot create a new project.");
            return;
        }
        console.log("Attempting to create a new project...");
        try {
            await driveState.createProjectHierarchy("New Project");
            console.log("New project created successfully!");
        } catch (error) {
            console.error("Failed to create a new project:", error);
        }
    };

    const handleAuthenticate = () => {
        console.log("Authentication button clicked.");
        if (driveState?.authenticate) {
            driveState.authenticate(); // Redirect to Google OAuth
        } else {
            console.error("Authentication method not available.");
        }
    };

    if (!driveState) {
        return <div>Loading Toolbar...</div>; // Loading state while initializing
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
