import React, { useState, memo } from 'react';
import './styles/App.css';
import './styles/variables.css'; // Import centralized variables
import Editor from './Components/Editor';
import Journal from './Components/Journal'; // Import the Journal component
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
  const [editorState, setEditorState] = useState({
    width: 600,
    height: 800,
    x: 100,
    y: 100,
    isLocked: false,
  });

  const [journalState, setJournalState] = useState({
    width: 400,
    height: 400,
    x: 200,
    y: 200,
    isLocked: false,
  });

  const [journalContent, setJournalContent] = useState("");

  const toggleEditorLock = () => {
    setEditorState((prevState) => ({
      ...prevState,
      isLocked: !prevState.isLocked,
    }));
  };

  const toggleJournalLock = () => {
    setJournalState((prevState) => ({
      ...prevState,
      isLocked: !prevState.isLocked,
    }));
  };

  const handleDragStop = (stateSetter) => (e, d) => {
    stateSetter((prevState) => ({
      ...prevState,
      x: d.x,
      y: d.y,
    }));
  };

  const handleResizeStop = (stateSetter) => (e, direction, ref, delta, position) => {
    stateSetter({
      width: parseInt(ref.style.width, 10),
      height: parseInt(ref.style.height, 10),
      x: position.x,
      y: position.y,
      isLocked: false, // Preserve lock state
    });
  };

  return (
    <GoogleDriveProvider>
      <EditorStateProvider>
        <div className="App">
          <Toolbar />
          <div className="desktop-layout">
            {/* Editor Module */}
            <Rnd
              className={`module ${editorState.isLocked ? 'locked' : ''}`}
              size={{ width: editorState.width, height: editorState.height }}
              position={{ x: editorState.x, y: editorState.y }}
              onDragStop={handleDragStop(setEditorState)}
              onResizeStop={handleResizeStop(setEditorState)}
              bounds="parent"
              enableResizing={!editorState.isLocked}
              disableDragging={editorState.isLocked}
            >
              <div className="module-content">
                <LockButton
                  isLocked={editorState.isLocked}
                  toggleLock={toggleEditorLock}
                />
                <Editor />
              </div>
            </Rnd>

            {/* Journal Module */}
            <Rnd
              className={`module ${journalState.isLocked ? 'locked' : ''}`}
              size={{ width: journalState.width, height: journalState.height }}
              position={{ x: journalState.x, y: journalState.y }}
              onDragStop={handleDragStop(setJournalState)}
              onResizeStop={handleResizeStop(setJournalState)}
              bounds="parent"
              enableResizing={!journalState.isLocked}
              disableDragging={journalState.isLocked}
            >
              <div className="module-content">
                <LockButton
                  isLocked={journalState.isLocked}
                  toggleLock={toggleJournalLock}
                />
                <Journal
                  content={journalContent}
                  updateContent={setJournalContent}
                />
              </div>
            </Rnd>
          </div>
        </div>
      </EditorStateProvider>
    </GoogleDriveProvider>
  );
}

export default App;
