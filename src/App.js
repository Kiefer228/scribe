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
    const [projectName, setProjectName] = useState(""); // Default project name is empty
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(true); // Track loading state
    const [errorMessage, setErrorMessage] = useState(null); // Handle error messages

    // State for module configuration
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
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const token = urlParams.get("token");

                if (token) {
                    console.log("[App] Token found in URL. Redirecting to store token.");
                    localStorage.setItem("authToken", token);
                    window.history.replaceState({}, document.title, "/"); // Clean URL
                }

                if (!authenticated) {
                    console.log("[App] User not authenticated. Redirecting to login.");
                    authenticate();
                } else {
                    console.log("[App] User authenticated. Loading initial project.");
                    const initialContent = await loadProject(projectName || "default-project");
                    setContent(initialContent || "");
                    setProjectName(projectName || "default-project");
                    console.log("[App] Project loaded successfully.");
                }
            } catch (error) {
                console.error("[App] Initialization error:", error.message);
                setErrorMessage("Failed to initialize application. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        initializeApp();
    }, [authenticated, authenticate, loadProject, projectName]);

    const handleSaveProject = async () => {
        try {
            setIsLoading(true);
            await saveProject(projectName, content);
            console.log("[App] Project saved successfully.");
        } catch (error) {
            console.error("[App] Error saving project:", error.message);
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
            console.log("[App] Project loaded successfully.");
        } catch (error) {
            console.error("[App] Error loading project:", error.message);
            setErrorMessage("Failed to load project. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSetProjectName = (name) => {
        console.log(`[App] Project name set to: ${name}`);
        setProjectName(name);
    };

    if (isLoading) {
        return <div className="loading-screen">Loading...</div>;
    }

    if (errorMessage) {
        return <div className="error-screen">{errorMessage}</div>;
    }

    return (
        <div className="App">
            <Toolbar
                onSave={handleSaveProject}
                onLoad={handleLoadProject}
                projectName={projectName}
                setProjectName={handleSetProjectName} // Pass setProjectName as a prop
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
            <button onClick={logout} style={{ marginTop: "10px" }}>
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
