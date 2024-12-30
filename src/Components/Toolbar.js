import React, { useState, useEffect } from "react";
import { useGoogleDrive } from "../context/useGoogleDrive";
import { useEditorState } from "../context/useEditorState";
import "../styles/variables.css";
import "../styles/toolbar.css";

const Toolbar = ({ setProjectName }) => {
    const { authenticated, authenticate, initialized, createProjectHierarchy, loadProject, saveProject } = useGoogleDrive();
    const { content, setContent } = useEditorState();
    const [isVisible, setIsVisible] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setIsVisible(e.clientY < 100); // Show toolbar when mouse is near the top of the screen
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    useEffect(() => {
        if (!authenticated) {
            console.log("[Toolbar] User not authenticated. Redirecting...");
            authenticate();
        }
    }, [authenticated, authenticate]);

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
        if (!initialized) {
            alert("Google Drive is not initialized. Please authenticate first.");
            return;
        }

        try {
            const projectName = getProjectName("create");
            console.log(`[Toolbar] Creating new project: "${projectName}"`);
            setIsLoading(true);
            await createProjectHierarchy(projectName);

            console.log(`[Toolbar] Automatically loading content.txt for project: "${projectName}"`);
            const newContent = await loadProject(projectName);
            setContent(newContent); // Update editor content via context

            alert(`Project "${projectName}" created and loaded successfully!`);
        } catch (error) {
            console.error("[Toolbar] Error creating project:", error.message);
            alert("Failed to create project. Check the console for details.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoad = async () => {
        if (!initialized) {
            alert("Google Drive is not initialized. Please authenticate first.");
            return;
        }

        try {
            const projectName = getProjectName("load");
            console.log(`[Toolbar] Loading project: "${projectName}"`);
            setIsLoading(true);
            const loadedContent = await loadProject(projectName);
            if (!loadedContent) {
                alert("No project found. Please create a new project.");
                return;
            }
            setContent(loadedContent); // Update editor content via context
            alert(`Loaded project: ${projectName}`);
        } catch (error) {
            console.error("[Toolbar] Error loading project:", error.message);
            alert("Failed to load project. Check the console for details.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!initialized) {
            alert("Google Drive is not initialized. Please authenticate first.");
            return;
        }

        try {
            const projectName = getProjectName("save");
            console.log(`[Toolbar] Saving project: "${projectName}"`);
            setIsLoading(true);
            await saveProject(projectName, content); // Save current content
            alert(`Saved project: ${projectName}`);
        } catch (error) {
            console.error("[Toolbar] Error saving project:", error.message);
            alert("Failed to save project. Check the console for details.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!authenticated || !authenticate) {
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
                    disabled={isLoading}
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
                    {initialized ? "● Online" : "○ Offline"}
                </span>
            </div>
        </div>
    );
};

export default Toolbar;
