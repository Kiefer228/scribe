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

    // The position management system: allows modules to provide their positions
    const [modulePositions, setModulePositions] = useState({});

    const registerModule = (moduleName, defaultPosition) => {
        setModulePositions((prev) => ({
            ...prev,
            [moduleName]: { ...defaultPosition, isLocked: false },
        }));
    };

    const updateModulePosition = (moduleName, newPosition) => {
        setModulePositions((prev) => ({
            ...prev,
            [moduleName]: { ...prev[moduleName], ...newPosition },
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
                <button onClick={handleRetry} style={{ marginTop: "10px" }}>
                    Retry
                </button>
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
                    {...modulePositions.journal}
                    onDragStop={(e, d) =>
                        updateModulePosition("journal", { x: d.x, y: d.y })
                    }
                >
                    <Journal registerModule={registerModule} content={content} setContent={setContent} />
                </ModuleContainer>
                <ModuleContainer
                    {...modulePositions.editor}
                    onDragStop={(e, d) =>
                        updateModulePosition("editor", { x: d.x, y: d.y })
                    }
                >
                    <Editor registerModule={registerModule} content={content} setContent={setContent} />
                </ModuleContainer>
            </div>
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
