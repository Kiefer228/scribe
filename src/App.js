import React, { useEffect, useState } from "react";
import "./styles/App.css";
import "./styles/variables.css";
import Editor from "./Components/Editor";
import Journal from "./Components/Journal";
import Toolbar from "./Components/Toolbar";
import ModuleContainer from "./Components/ModuleContainer";
import { EditorStateProvider } from "./context/useEditorState";
import { GoogleDriveProvider, useGoogleDrive } from "./context/useGoogleDrive";

function AppContent() {
    const { authenticated, authenticate, logout, saveProject, loadProject } = useGoogleDrive();

    const [projectName, setProjectName] = useState("default-project");

    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    const [moduleConfig, setModuleConfig] = useState({
        journal: { width: 400, height: 300, x: 0, y: 0, isLocked: false },
        editor: { width: 600, height: 400, x: 450, y: 0, isLocked: false },
    });

    const updateModuleConfig = (moduleName, updates) => {
        setModuleConfig((prev) => ({
            ...prev,
            [moduleName]: { ...prev[moduleName], ...updates },
        }));
    };

    useEffect(() => {
        const initializeApp = async () => {
            const retryLimit = 3;
            let attempts = 0;
            while (attempts < retryLimit) {
                try {
                    const urlParams = new URLSearchParams(window.location.search);
                    const token = urlParams.get("token");

                    if (token) {
                        localStorage.setItem("authToken", token);
                        window.history.replaceState({}, document.title, "/");
                    }

                    if (!authenticated) {
                        if (!urlParams.get("retry")) {
                            console.warn("[AppContent] First authentication attempt failed, retrying...");
                            authenticate();
                        } else {
                            console.error("[AppContent] Repeated authentication failure detected. Displaying error message.");
                            setErrorMessage("Unable to authenticate. Please check your login credentials.");
                        }
                    } else {
                        const initialContent = await loadProject(projectName);
                        setContent(initialContent || "");
                    }
                    return; // Exit the loop on success
                } catch (error) {
                    attempts += 1;
                    console.warn(`[AppContent] Initialization attempt ${attempts} failed:`, error.message);
                    if (attempts >= retryLimit) {
                        if (error.message.includes("network")) {
                            setErrorMessage("Failed to initialize application due to network issues. Please check your connection and retry.");
                        } else {
                            setErrorMessage("Failed to initialize application. Please try again or click retry.");
                        }
                    }
                } finally {
                    setIsLoading(false);
                }
            }
        };

        initializeApp();
    }, [authenticated, authenticate, loadProject, projectName]);

    const handleRetry = async () => {
        setIsLoading(true);
        setErrorMessage(null);
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get("token");

            if (token) {
                localStorage.setItem("authToken", token);
                window.history.replaceState({}, document.title, "/");
            }

            const initialContent = await loadProject(projectName);
            setContent(initialContent || "");
        } catch (error) {
            setErrorMessage("Retry failed. Please check your connection and try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveProject = async () => {
        try {
            setIsLoading(true);
            await saveProject(projectName, content);
        } catch {
            setErrorMessage("Failed to save project. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoadProject = async () => {
        try {
            setIsLoading(true);
            const projectContent = await loadProject(projectName);
            setContent(projectContent);
        } catch {
            setErrorMessage("Failed to load project. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSetProjectName = (name) => {
       
      ctName(name);
    };

    if (isLoading) {
        return (
            <div className="loading-screen">
                <div className="spinner"></div>
                <p>Loading... Please wait while we initialize your application.</p>
                <p>If this takes longer than expected, ensure your internet connection is stable.</p>
            </div>
        );
    }

    if (errorMessage) {
        return (
            <div className="error-screen">
                {errorMessage}
                <button onClick={handleRetry} style={{ marginTop: "10px" }}>Retry</button>
            </div>
        );
    }

    return (
        <div className="App">
            <Toolbar
                onSave={handleSaveProject}
                onLoad={handleLoadProject}
                projectName={projectName}
                setProjectName={handleSetProjectName}
            />
            <div className="desktop-layout">
                <ModuleContainer
                    {...moduleConfig.journal}
                    onDragStop={(e, d) =>
                        updateModuleConfig("journal", { x: d.x, y: d.y })
                    }
                    onResizeStop={(e, direction, ref, delta, position) =>
                        updateModuleConfig("journal", {
                            width: ref.offsetWidth,
                            height: ref.offsetHeight,
                            ...position,
                        })
                    }
                >
                    <Journal content={content} setContent={setContent} />
                </ModuleContainer>
                <ModuleContainer
                    {...moduleConfig.editor}
                    onDragStop={(e, d) =>
                        updateModuleConfig("editor", { x: d.x, y: d.y })
                    }
                    onResizeStop={(e, direction, ref, delta, position) =>
                        updateModuleConfig("editor", {
                            width: ref.offsetWidth,
                            height: ref.offsetHeight,
                            ...position,
                        })
                    }
                >
                    <Editor content={content} setContent={setContent} />
                </ModuleContainer>
            </div>
            <button onClick={() => { if (window.confirm('Are you sure you want to log out?')) logout(); }} style={{ marginTop: "10px" }}>
                Logout
            </button>
        </div>
    );
}

function App() {
    return (
        <GoogleDriveProvider>
            <EditorStateProvider>
                <AppContent />
            </EditorStateProvider>
        </GoogleDriveProvider>
    );
}

export default App;
