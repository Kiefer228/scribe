import React, { useState, useEffect } from "react";
import { useGoogleDrive } from "../context/useGoogleDrive";
import "../styles/variables.css";
import "../styles/toolbar.css";

const Toolbar = () => {
    const driveState = useGoogleDrive(); // Directly consume the context
    const [isVisible, setIsVisible] = useState(true);
    const [isPopupOpen, setIsPopupOpen] = useState(false); // Controls popup visibility
    const [projectName, setProjectName] = useState(""); // Tracks project name

    useEffect(() => {
        const handleMouseMove = (e) => {
            setIsVisible(e.clientY < 100); // Show toolbar when mouse is near the top of the screen
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const handleNewProject = async () => {
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
            setIsPopupOpen(false); // Close the popup
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

    const openPopup = () => {
        if (!driveState?.initialized) {
            console.error("Google Drive is not initialized. Cannot create a new project.");
            alert("Google Drive is not initialized. Please authenticate first.");
            return;
        }
        setIsPopupOpen(true); // Open the popup
    };

    const closePopup = () => {
        setIsPopupOpen(false); // Close the popup
        setProjectName(""); // Reset project name
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
                    onClick={openPopup}
                    disabled={!driveState?.initialized} // Disable if not initialized
                >
                    Create Project
                </button>
            </div>
            <div className="toolbar-right">
                <span className="connection-status">
                    {driveState?.initialized ? "● Online" : "○ Offline"}
                </span>
            </div>

            {/* Popup for project name input */}
            {isPopupOpen && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h3>Enter Project Name</h3>
                        <input
                            type="text"
                            className="popup-input"
                            placeholder="Project name"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                        />
                        <div className="popup-buttons">
                            <button
                                className="popup-button"
                                onClick={handleNewProject}
                                disabled={!projectName.trim()} // Disable if name is empty
                            >
                                Create
                            </button>
                            <button
                                className="popup-button popup-button-cancel"
                                onClick={closePopup}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Toolbar;
