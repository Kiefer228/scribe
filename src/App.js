import React, { useState } from 'react';
import './styles/App.css';
import Editor from './Components/Editor';
import Toolbar from './Components/Toolbar';
import { Rnd } from 'react-rnd';
import { EditorStateProvider } from './context/useEditorState';
import { GoogleDriveProvider } from './context/useGoogleDrive';

function App() {
  const [moduleState, setModuleState] = useState({
    width: 600,
    height: 800,
    x: 100,
    y: 100,
  });

  const handleDragStop = (e, d) => {
    setModuleState((prevState) => ({
      ...prevState,
      x: d.x,
      y: d.y,
    }));
  };

  const handleResizeStop = (e, direction, ref, delta, position) => {
    setModuleState({
      width: parseInt(ref.style.width, 10),
      height: parseInt(ref.style.height, 10),
      x: position.x,
      y: position.y,
    });
  };

  return (
    <GoogleDriveProvider>
      <EditorStateProvider>
        <div className="App">
          <Toolbar />
          <div className="desktop-layout">
            <Rnd
              className="module"
              size={{ width: moduleState.width, height: moduleState.height }}
              position={{ x: moduleState.x, y: moduleState.y }}
              onDragStop={handleDragStop}
              onResizeStop={handleResizeStop}
              bounds="parent"
              enableResizing={{
                top: true,
                right: true,
                bottom: true,
                left: true,
                topRight: true,
                bottomRight: true,
                bottomLeft: true,
                topLeft: true,
              }}
              dragHandleClassName="drag-edge"
            >
              <div className="module-content">
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
