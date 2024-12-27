import React, { useState } from 'react';
import './styles/App.css';
import Editor from './Components/Editor';
import Toolbar from './Components/Toolbar';
import { Rnd } from 'react-rnd';
import { EditorStateProvider } from './context/useEditorState';
import { GoogleDriveProvider } from './context/useGoogleDrive';

function App() {
  const [moduleSize, setModuleSize] = useState({ width: 600, height: 800 }); // Default size for Editor module
  const [editorPosition, setEditorPosition] = useState({ x: 100, y: 100 }); // Relatively centered default position

  return (
    <GoogleDriveProvider>
      <EditorStateProvider>
        <div className="App">
          <Toolbar />
          <div className="desktop-layout">
            {/* Editor Module */}
            <Rnd
              className="module"
              size={moduleSize}
              position={editorPosition}
              onDragStop={(e, d) => {
                setEditorPosition({ x: d.x, y: d.y });
              }}
              onResizeStop={(e, direction, ref) => {
                setModuleSize({
                  width: ref.offsetWidth,
                  height: ref.offsetHeight,
                });
              }}
              bounds="parent"
              enableResizing={{
                top: true,
                right: true,
                bottom: true,
                left: true,
              }}
            >
              <div className="module-content" style={{ width: '100%', height: '100%' }}>
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
