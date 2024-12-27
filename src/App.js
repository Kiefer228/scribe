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
                x: 660,
                y: 100,
              }}
              bounds="parent"
              enableResizing={{
                top: true,
                right: true,
                bottom: true,
                left: true,
              }}
              disableDragging={true} // Prevent dragging the module directly
              onResizeStop={(e, direction, ref, delta, position) => {
                // Update size and position after resizing
              }}
              onResize={(e, direction, ref, delta, position) => {
                // While resizing, allow movement through position updates
                ref.style.transform = `translate(${position.x}px, ${position.y}px)`;
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
