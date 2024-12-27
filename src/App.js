import React from 'react';
import './styles/App.css';
import Editor from './Components/Editor';
import Toolbar from './Components/Toolbar';
import { Rnd } from 'react-rnd';
import { EditorStateProvider } from './context/useEditorState';
import { GoogleDriveProvider } from './context/useGoogleDrive';

function App() {
  return (
    <GoogleDriveProvider>
      <EditorStateProvider>
        <div className="App">
          <Toolbar />
          <div className="desktop-layout">
            {/* Editor Module */}
            <Rnd
              className="module"
              default={{
                width: 600,
                height: 800,
                x: 100,
                y: 100,
              }}
              bounds="parent"
              enableResizing={{
                topLeft: true,
                topRight: true,
                bottomLeft: true,
                bottomRight: true,
              }}
              dragHandleClassName="drag-edge" // Use edges for dragging
            >
              <div className="module-content">
                {/* Invisible edges for dragging */}
                <div className="drag-edge top" />
                <div className="drag-edge left" />
                <div className="drag-edge right" />
                <div className="drag-edge bottom" />

                {/* Editor Component */}
                <Editor />
              </div>
            </Rnd>
          </div>
        </div>
      </EditorStateProvider>
    </GoogleDriveProvider>
  );
}

export default App;
