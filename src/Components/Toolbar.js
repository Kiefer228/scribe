import React, { useState, useEffect } from "react";
import { useGoogleDrive } from "../context/useGoogleDrive";
import { loadProject, saveProject } from "../api"; // Import backend API functions
import "../styles/variables.css";
import "../styles/toolbar.css";

const Toolbar = ({ editorContent, setEditorContent }) => {
    const driveState = useGoogleDrive(); // Directly consume the context
    const [isVisible, setIsVisible] = useState(true);
    const [isLoading, setIsLoading] = useState(false); // Track loading state

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

    const getProjectName = (action) => {
        const projectName = window.prompt(`Enter the project name to ${action}:`, "");
        if (!projectName) {
            alert("Project name is required.");
            throw new Error("Project name is missing.");
        }
        return projectName;
    };

    const handleNewProject = async () => {
        if (!driveState?.initialized) {
            alert("Google Drive is not initialized. Please authenticate first.");
            return;
        }

        try {
            const projectName = getProjectName("create");
            console.log(`Creating a new project: "${projectName}"`);
            setIsLoading(true);
            await driveState.createProjectHierarchy(projectName);
            alert(`Project "${projectName}" created successfully!`);
        } catch (error) {
            console.error("Error creating project:", error);
            alert("Failed to create project. Check the console for details.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoad = async () => {
        try {
            const projectName = getProjectName("load");
            console.log(`Loading project: "${projectName}"`);
            setIsLoading(true);
            const content = await loadProject(projectName);
            setEditorContent(content); // Update the editor content
            alert(`Loaded project: ${projectName}`);
        } catch (error) {
            alert("Failed to load project. Check the console for details.");
            console.error("Error loading project:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            const projectName = getProjectName("save");
            console.log(`Saving project: "${projectName}"`);
            setIsLoading(true);
            await saveProject(projectName, editorContent);
            alert(`Saved project: ${projectName}`);
        } catch (error) {
            alert("Failed to save project. Check the console for details.");
            console.error("Error saving project:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!driveState || !driveState.authenticate) {
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
                    disabled={!driveState?.initialized || isLoading} // Disable when loading
                >
                    {isLoading ? "Processing..." : "New"}
                </button>
                <button
                    className="toolbar-button"
                    onClick={handleLoad}
                    disabled={isLoading} // Disable when loading
                >
                    {isLoading ? "Loading..." : "Load"}
                </button>
                <button
                    className="toolbar-button"
                    onClick={handleSave}
                    disabled={isLoading} // Disable when loading
                >
                    {isLoading ? "Saving..." : "Save"}
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
