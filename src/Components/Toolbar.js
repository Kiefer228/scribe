import React, { useState, useEffect } from "react";
import { useGoogleDrive } from "../context/useGoogleDrive";
import { useEditorState } from "../context/useEditorState";
import "../styles/variables.css";
import "../styles/toolbar.css";
import { throttle } from "lodash";

const Toolbar = ({ setProjectName }) => {
    const { authenticated, authenticate, initialized, createProjectHierarchy, loadProject, saveProject } = useGoogleDrive();
    const { content, setContent } = useEditorState();
    const [isVisible, setIsVisible] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [projectNameInput, setProjectNameInput] = useState("");
    const [showInputModal, setShowInputModal] = useState(false);
    const [currentAction, setCurrentAction] = useState("");
    const [hasAuthenticatedOnce, setHasAuthenticatedOnce] = useState(false);

    const handleLogin = () => {
        authenticate(); // Login only when triggered manually
    };

    useEffect(() => {
        const handleMouseMove = throttle((e) => {
            setIsVisible(e.clientY < 100);
        }, 200);

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const getProjectName = (action) => {
        setCurrentAction(action);
        setShowInputModal(true);
    };

    const handleModalSubmit = () => {
        if (!projectNameInput.trim()) {
            alert("Project name is required.");
            return;
        }
        setProjectName(projectNameInput);
        setShowInputModal(false);
        executeAction(currentAction);
    };

    const executeAction = (action) => {
        switch (action) {
            case "create":
                handleNewProject();
                break;
            case "load":
                handleLoad();
                break;
            case "save":
                handleSave();
                break;
            default:
                break;
        }
    };

    const handleNewProject = async () => {
        if (!initialized) {
            alert("Google Drive is not initialized. Please authenticate first.");
            return;
        }

        try {
            setIsLoading(true);
            await createProjectHierarchy(projectNameInput);
            alert(`Project hierarchy for "${projectNameInput}" created successfully.`);

            const newContent = await loadProject(projectNameInput);
            setContent(newContent);
            alert(`Project "${projectNameInput}" loaded successfully.`);
        } catch (error) {
            alert(error.message.includes("hierarchy") ? "Failed to create project hierarchy. Check the console for details." : "Failed to load project content. Check the console for details.");
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
            setIsLoading(true);
            const loadedContent = await loadProject(projectNameInput);
            if (!loadedContent) {
                alert("No project found. Please create a new project.");
                return;
            }
            setContent(loadedContent);
            alert(`Loaded project: ${projectNameInput}`);
        } catch (error) {
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
            setIsLoading(true);
            await saveProject(projectNameInput, content);
            alert(`Saved project: ${projectNameInput}`);
        } catch (error) {
            alert("Failed to save project. Check the console for details.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button className="toolbar-button" onClick={handleLogin}>
                Login
            </button>
            {showInputModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Enter Project Name</h3>
                        <input
                            type="text"
                            value={projectNameInput}
                            onChange={(e) => setProjectNameInput(e.target.value)}
                        />
                        <button onClick={handleModalSubmit}>Submit</button>
                        <button onClick={() => setShowInputModal(false)}>Cancel</button>
                    </div>
                </div>
            )}
            <div className={`toolbar ${isVisible ? "visible" : ""}`}>
                <div className="toolbar-left">
                    <button onClick={() => getProjectName("create")} disabled={isLoading}>
                        {isLoading ? "Processing..." : "New"}
                    </button>
                    <button onClick={() => getProjectName("load")} disabled={isLoading}>
                        {isLoading ? "Loading..." : "Load"}
                    </button>
                    <button onClick={() => getProjectName("save")} disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save"}
                    </button>
                </div>
                <div className="toolbar-right">
                    <span className="connection-status">
                        {initialized ? "● Online" : "○ Offline"}
                    </span>
                </div>
            </div>
        </>
    );
};

export default Toolbar;
