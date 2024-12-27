import React, { useState, memo } from 'react';
import './styles/App.css';
import './styles/variables.css'; // Import centralized variables
import Editor from './Components/Editor';
import Toolbar from './Components/Toolbar';
import { Rnd } from 'react-rnd';
import { EditorStateProvider } from './context/useEditorState';
import { GoogleDriveProvider } from './context/useGoogleDrive';

const LockButton = memo(({ isLocked, toggleLock }) => (
  <button
    className="lock-button"
    onClick={toggleLock}
    aria-label="Toggle Lock"
    aria-pressed={isLocked}
  >
    {isLocked ? '🔒' : '🔓'}
  </button>
));

function App() {
  const [moduleState, setModuleState] = useState({
    width: 600,
    height: 800,
    x: 100,
    y: 100,
    isLocked: false,
  });

  const toggleLock = () => {
    setModuleState((prevState) => ({
      ...prevState,
      isLocked: !prevState.isLocked,
    }));
  };

  const handleDragStop = (e, d) => {
    if (!moduleState.isLocked) {
      setModuleState((prevState) => ({
        ...prevState,
        x: d.x,
        y: d.y,
      }));
    }
  };

  const handleResizeStop = (e, direction, ref, delta, position) => {
    if (!moduleState.isLocked) {
      setModuleState({
        width: parseInt(ref.style.width, 10),
        height: parseInt(ref.style.height, 10),
        x: position.x,
        y: position.y,
        isLocked: moduleState.isLocked,
      });
    }
  };

  return (
    <GoogleDriveProvider>
      <EditorStateProvider>
        <div className="App">
          <Toolbar />
          <div className="desktop-layout">
            <Rnd
              className={`module ${moduleState.isLocked ? 'locked' : ''}`}
              size={{ width: moduleState.width, height: moduleState.height }}
              position={{ x: moduleState.x, y: moduleState.y }}
              onDragStop={handleDragStop}
              onResizeStop={handleResizeStop}
              bounds="parent"
              enableResizing={!moduleState.isLocked}
              disableDragging={moduleState.isLocked}
            >
              <div className="module-content">
                <LockButton isLocked={moduleState.isLocked} toggleLock={toggleLock} />
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
