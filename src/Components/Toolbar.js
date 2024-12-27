import React, { useState, useEffect } from 'react';
import { useEditorState } from '../context/useEditorState';
import { useGoogleDrive } from '../context/useGoogleDrive';
import '../styles/variables.css';
import '../styles/toolbar.css';

const Toolbar = () => {
  const { content } = useEditorState();
  const { saveFile, loadFile, driveState } = useGoogleDrive();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setIsVisible(e.clientY < 100); // Only show toolbar when mouse is near the top of the screen
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Disable buttons if necessary context values are not initialized
  const isDriveInitialized = saveFile && loadFile && driveState;

  const handleSave = async () => {
    if (isDriveInitialized) {
      try {
        await saveFile('sample-file-path.txt', content);
        alert('File saved to Google Drive!');
      } catch (error) {
        console.error('Error saving file:', error);
      }
    } else {
      console.error('Drive is not initialized, cannot save.');
    }
  };

  const handleLoad = async () => {
    if (isDriveInitialized) {
      try {
        await loadFile('sample-file-path.txt');
        alert('File loaded from Google Drive!');
      } catch (error) {
        console.error('Error loading file:', error);
      }
    } else {
      console.error('Drive is not initialized, cannot load.');
    }
  };

  const handleNewProject = () => {
    const name = prompt('Enter the name of your new project:');
    if (name) {
      alert(`New project created: ${name}`);
    }
  };

  return (
    <div className={`toolbar ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="toolbar-left">
        <button
          className="toolbar-button"
          onClick={handleNewProject}
          disabled={!isDriveInitialized}
        >
          New Project
        </button>
        <button
          className="toolbar-button"
          onClick={handleSave}
          disabled={!isDriveInitialized}
        >
          Save
        </button>
        <button
          className="toolbar-button"
          onClick={handleLoad}
          disabled={!isDriveInitialized}
        >
          Load
        </button>
      </div>
      <div className="toolbar-right">
        <button className="toolbar-button stuck-button">I'm Stuck</button>
        <span className="connection-status">
          {driveState?.initialized ? '● Online' : '○ Offline'}
        </span>
      </div>
    </div>
  );
};

export default Toolbar;
