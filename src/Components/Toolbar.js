import React, { useState, useEffect } from "react";
import { useEditorState } from "../context/useEditorState";
import { useGoogleDrive } from "../context/useGoogleDrive";
import "../styles/variables.css";
import "../styles/toolbar.css";

const Toolbar = () => {
    const { setContent } = useEditorState();
    const { driveState = { initialized: false, createProjectHierarchy: () => {} } } = useGoogleDrive(); // Provide a fallback default
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setIsVisible(e.clientY < 100); // Show toolbar when mouse is near the top of the screen
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const handleNewProject = async () => {
        if (!driveState.initialized) {
            console.error("Google Drive is not initialized. Cannot create a new project.");
            return;
        }

        const projectName = prompt("Enter the name of your new project:");
        if (!projectName) {
            console.warn("No project name provided.");
            return;
        }

        try {
            await driveState.createProjectHierarchy(projectName);
            setContent(""); // Reset editor content to blank
            alert(`Project "${projectName}" created successfully.`);
        } catch (error) {
            console.error("Error creating new project:", error);
            alert("Failed to create the project. Please try again.");
        }
    };

    return (
        <div className={`toolbar ${isVisible ? "visible" : "hidden"}`}>
            <div className="toolbar-left">
                <button
                    className="toolbar-button"
                    onClick={handleNewProject}
                    disabled={!driveState.initialized}
                >
                    New Project
                </button>
            </div>
            <div className="toolbar-right">
                <span className="connection-status">
                    {driveState.initialized ? "● Online" : "○ Offline"}
                </span>
            </div>
        </div>
    );
};

export default Toolbar;
