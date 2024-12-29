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

    useEffect(() => {
        if (!authenticated) {
            console.log("[App] User not authenticated. Redirecting to login.");
            authenticate(); // Automatically redirect to login if not authenticated
        }
    }, [authenticated, authenticate]);

    useEffect(() => {
        const fetchInitialProject = async () => {
            if (authenticated && loadProject) {
                console.log("[App] Attempting to load the first available project...");
                try {
                    setIsLoading(true);
                    const initialContent = await loadProject(projectName || "default-project");
                    setContent(initialContent || ""); // Load content or set empty if not found
                    setProjectName(projectName || "default-project");
                    console.log("[App] Project loaded successfully.");
                } catch (error) {
                    console.error("[App] Error loading project:", error.message);
                    if (error.message.includes("404")) {
                        alert("No projects found. Please create a new one.");
                    }
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchInitialProject();
    }, [authenticated, loadProject, projectName]);

    const handleSave = async () => {
        if (!saveProject) return;
        try {
            setIsLoading(true);
            await saveProject(projectName, content);
            console.log("[App] Project saved successfully.");
        } catch (error) {
            console.error("[App] Error saving project:", error.message);
            alert("Failed to save the project. Check the console for details.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSetProjectName = (name) => {
        console.log(`[App] Project name set to: ${name}`);
        setProjectName(name);
    };

    if (!authenticated) {
        return <div>Loading...</div>; // Show a loading state while checking authentication
    }

    if (isLoading) {
        return <div>Loading project...</div>; // Show a loading state for project fetching
    }

    return (
        <div className="App">
            <Toolbar
                onSave={handleSave}
                setProjectName={handleSetProjectName} // Pass setProjectName as a prop
            />
            <div className="desktop-layout">
                <ModuleContainer
                    width={600}
                    height={800}
                    isMovable={true}
                    isResizable={true}
                >
                    <Editor content={content} setContent={setContent} />
                </ModuleContainer>
                <ModuleContainer
                    width={400}
                    height={400}
                    isMovable={true}
                    isResizable={false}
                >
                    <Journal />
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
