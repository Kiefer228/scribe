import React, { useState, useEffect } from 'react';
import './styles/App.css';
import './styles/variables.css'; // Import centralized variables
import Editor from './Components/Editor';
import Journal from './Components/Journal';
import Toolbar from './Components/Toolbar';
import ModuleContainer from './Components/ModuleContainer';
import { EditorStateProvider } from './context/useEditorState';
import { GoogleDriveProvider } from './context/useGoogleDrive';

function App() {
  const [editorState, setEditorState] = useState({
    width: 600,
    height: 800,
    x: 0, // Centered dynamically
    y: 0, // Centered dynamically
    isLocked: false,
  });

  const [journalState, setJournalState] = useState({
    width: 400,
    height: 400,
    x: 0, // Left-centered dynamically
    y: 0, // Left-centered dynamically
    isLocked: false,
  });

  useEffect(() => {
    // Center Editor in the viewport
    const updatePositions = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      setEditorState((prevState) => ({
        ...prevState,
        x: (viewportWidth - prevState.width) / 2,
        y: (viewportHeight - prevState.height) / 2,
      }));

      setJournalState((prevState) => ({
        ...prevState,
        x: (viewportWidth / 4 - prevState.width / 2) - (prevState.width / 4), // Further to the left
        y: (viewportHeight - prevState.height) / 2,
      }));
    };

    updatePositions();
    window.addEventListener('resize', updatePositions); // Recalculate on window resize
    return () => window.removeEventListener('resize', updatePositions);
  }, []);

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
            <ModuleContainer
              width={editorState.width}
              height={editorState.height}
              x={editorState.x}
              y={editorState.y}
              isMovable={true}
              isResizable={true}
              isLocked={editorState.isLocked}
              toggleLock={toggleEditorLock}
              onDragStop={handleDragStop(setEditorState)}
              onResizeStop={handleResizeStop(setEditorState)}
            >
              <Editor />
            </ModuleContainer>

            {/* Journal Module */}
            <ModuleContainer
              width={journalState.width}
              height={journalState.height}
              x={journalState.x}
              y={journalState.y}
              isMovable={true}
              isResizable={false} // Journal is not resizable
              isLocked={journalState.isLocked}
              toggleLock={toggleJournalLock}
              onDragStop={handleDragStop(setJournalState)}
            >
              <Journal
                content={journalContent}
                updateContent={setJournalContent}
              />
            </ModuleContainer>
          </div>
        </div>
      </EditorStateProvider>
    </GoogleDriveProvider>
  );
}

export default App;
