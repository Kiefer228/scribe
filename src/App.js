import React, { useState } from "react";
import "./styles/App.css";
import "./styles/variables.css";
import Editor from "./Components/Editor";
import Journal from "./Components/Journal";
import Toolbar from "./Components/Toolbar";
import ModuleContainer from "./Components/ModuleContainer";
import { EditorStateProvider } from "./context/useEditorState";

function AppContent() {
    const [projectName, setProjectName] = useState("default-project");
    const [content, setContent] = useState("");
    const [isLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    const [moduleConfig, setModuleConfig] = useState({
        journal: { x: 0, y: 400, isLocked: true },
        editor: { x: 640, y: 100, isLocked: true },
    });

    const updateModuleConfig = (moduleName, updates) => {
        setModuleConfig((prev) => ({
            ...prev,
            [moduleName]: { ...prev[moduleName], ...updates },
        }));
    };

    const handleSaveProject = () => {
        alert("Save functionality is disabled in offline mode.");
    };

    const handleLoadProject = () => {
        alert("Load functionality is disabled in offline mode.");
    };

    const handleRetry = () => {
        setErrorMessage("Retry functionality is disabled in offline mode.");
    };

    const handleSetProjectName = (name) => {
        setProjectName(name);
    };

    if (isLoading) {
        return (
            <div className="loading-screen">
                <div className="spinner"></div>
                <p>Loading... Please wait while we initialize your application.</p>
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
                >
                    <Journal content={content} setContent={setContent} />
                </ModuleContainer>
                <ModuleContainer
                    {...moduleConfig.editor}
                    onDragStop={(e, d) =>
                        updateModuleConfig("editor", { x: d.x, y: d.y })
                    }
                >
                    <Editor content={content} setContent={setContent} />
                </ModuleContainer>
            </div>
            <button onClick={() => alert('Logout functionality is disabled in offline mode.')} style={{ marginTop: "10px" }}>
                Logout
            </button>
        </div>
    );
}

function App() {
    return (
        <EditorStateProvider>
            <AppContent />
        </EditorStateProvider>
    );
}

export default App;
