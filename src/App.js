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
    const [projectName, setProjectName] = useState("example-project"); // Example project name
    const [content, setContent] = useState("");

    useEffect(() => {
        if (!authenticated) {
            console.log("[App] User not authenticated. Redirecting to login.");
            authenticate(); // Automatically redirect to login if not authenticated
        }
    }, [authenticated, authenticate]);

    useEffect(() => {
        if (authenticated) {
            // Load project when authenticated
            loadProject(projectName)
                .then((projectContent) => {
                    console.log("[App] Project loaded successfully.");
                    setContent(projectContent);
                })
                .catch((error) => {
                    console.error("[App] Error loading project:", error);
                });
        }
    }, [authenticated, loadProject, projectName]);

    const handleSave = () => {
        saveProject(projectName, content)
            .then(() => console.log("[App] Project saved successfully."))
            .catch((error) => console.error("[App] Error saving project:", error));
    };

    if (!authenticated) {
        return <div>Loading...</div>; // Show a loading state while checking authentication
    }

    return (
        <div className="App">
            <Toolbar onSave={handleSave} />
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
