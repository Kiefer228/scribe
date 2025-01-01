import React from "react";
import "./styles/App.css";
import "./styles/variables.css";
import Editor from "./Components/Editor";
import Journal from "./Components/Journal";
import Toolbar from "./Components/Toolbar";
import ModuleContainer from "./Components/ModuleContainer";
import { EditorStateProvider } from "./context/useEditorState";

function AppContent() {
  return (
    <div className="App">
      <Toolbar />
      <div className="desktop-layout">
        <ModuleContainer moduleName="journal" defaultPosition={{ x: 50, y: 50, width: 300, height: 400 }}>
          <Journal />
        </ModuleContainer>
        <ModuleContainer moduleName="editor" defaultPosition={{ x: 400, y: 50, width: 600, height: 400 }}>
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
