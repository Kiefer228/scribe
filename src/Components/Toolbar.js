import React, { useState, useEffect } from "react";
import { useGoogleDrive } from "../context/useGoogleDrive";
import { useEditorState } from "../context/useEditorState"; // Import EditorState context
import "../styles/variables.css";
import "../styles/toolbar.css";

const Toolbar = ({ setProjectName }) => {
    const driveState = useGoogleDrive(); // Directly consume the Google Drive context
    const { content, updateContent } = useEditorState(); // Use editor state
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
        if (!driveState?.authenticated) {
            console.log("[Toolbar] User not authenticated. Redirecting...");
            driveState.authenticate();
        }
    }, [driveState]);

    const getProjectName = (action) => {
        const projectName = window.prompt(`Enter the project name to ${action}:`, "");
        if (!projectName) {
            alert("Project name is required.");
            throw new Error("Project name is missing.");
        }
        setProjectName(projectName); // Update the project name in the parent state
        return projectName;
    };

    const handleNewProject = async () => {
        if (!driveState?.initialized) {
            alert("Google Drive is not initialized. Please authenticate first.");
            return;
        }

        try {
            const projectName = getProjectName("create");
            console.log(`[Toolbar] Creating new project: "${projectName}"`);
            setIsLoading(true);
            await driveState.createProjectHierarchy(projectName);

            console.log(`[Toolbar] Automatically loading content.txt for project: "${projectName}"`);
            const newContent = await driveState.loadProject(projectName);
            updateContent(newContent); // Update editor content via context

            alert(`Project "${projectName}" created and loaded successfully!`);
        } catch (error) {
            console.error("[Toolbar] Error creating project:", error.message);
            alert("Failed to create project. Check the console for details.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoad = async () => {
        if (!driveState?.initialized) {
            alert("Google Drive is not initialized. Please authenticate first.");
            return;
        }

        try {
            const projectName = getProjectName("load");
            console.log(`[Toolbar] Loading project: "${projectName}"`);
            setIsLoading(true);
            const loadedContent = await driveState.loadProject(projectName);
            if (!loadedContent) {
                alert("No project found. Please create a new project.");
                return;
            }
            updateContent(loadedContent); // Update editor content via context
            alert(`Loaded project: ${projectName}`);
        } catch (error) {
            console.error("[Toolbar] Error loading project:", error.message);
            alert("Failed to load project. Check the console for details.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!driveState?.initialized) {
            alert("Google Drive is not initialized. Please authenticate first.");
            return;
        }

        try {
            const projectName = getProjectName("save");
            console.log(`[Toolbar] Saving project: "${projectName}"`);
            setIsLoading(true);
            await driveState.saveProject(projectName, content); // Save current content
            alert(`Saved project: ${projectName}`);
        } catch (error) {
            console.error("[Toolbar] Error saving project:", error.message);
            alert("Failed to save project. Check the console for details.");
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
                    disabled={!driveState?.initialized || isLoading}
                >
                    {isLoading ? "Processing..." : "New"}
                </button>
                <button
                    className="toolbar-button"
                    onClick={handleLoad}
                    disabled={isLoading}
                >
                    {isLoading ? "Loading..." : "Load"}
                </button>
                <button
                    className="toolbar-button"
                    onClick={handleSave}
                    disabled={isLoading}
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
