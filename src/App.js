import React, { useState } from "react";
import "./styles/App.css";
import "./styles/variables.css";
import Editor from "./Components/Editor";
import Journal from "./Components/Journal";
import Toolbar from "./Components/Toolbar";
import ModuleContainer from "./Components/ModuleContainer";
import { EditorStateProvider } from "./context/useEditorState";

function AppContent() {
  const [modules, setModules] = useState({
    journal: { x: 150, y: 100, width: 400, height: 800 },
    editor: { x: 650, y: 100, width: 600, height: 800 },
  });

  const handleDragStop = (moduleName, newPosition) => {
    setModules((prev) => ({
      ...prev,
      [moduleName]: { ...prev[moduleName], ...newPosition },
    }));
  };

  const handleResizeStop = (moduleName, newDimensions) => {
    setModules((prev) => ({
      ...prev,
      [moduleName]: { ...prev[moduleName], ...newDimensions },
    }));
  };

  return (
    <div className="App">
      <Toolbar />
      <div className="desktop-layout">
        <ModuleContainer
          moduleName="journal"
          size={{ width: modules.journal.width, height: modules.journal.height }}
          position={{ x: modules.journal.x, y: modules.journal.y }}
          onDragStop={handleDragStop}
          onResizeStop={handleResizeStop}
        >
          <Journal />
        </ModuleContainer>
        <ModuleContainer
          moduleName="editor"
          size={{ width: modules.editor.width, height: modules.editor.height }}
          position={{ x: modules.editor.x, y: modules.editor.y }}
          onDragStop={handleDragStop}
          onResizeStop={handleResizeStop}
        >
          <Editor />
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
