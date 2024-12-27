import React, { useState, useEffect } from 'react';
import { useEditorState } from '../context/useEditorState';
import { useGoogleDrive } from '../context/useGoogleDrive';
import '../styles/variables.css';
import '../styles/toolbar.css';

const Toolbar = () => {
  const { content } = useEditorState();
  const { createProjectHierarchy, driveState } = useGoogleDrive();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setIsVisible(e.clientY < 100); // Only show toolbar when mouse is near the top of the screen
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleNewProject = async () => {
    if (driveState.initialized) {
      const projectName = prompt('Enter the name of your new project:');
      if (projectName) {
        try {
          await createProjectHierarchy(projectName);
        } catch (error) {
          console.error('Error creating new project:', error);
        }
      }
    } else {
      console.error('Drive is not initialized, cannot create project.');
    }
  };

  return (
    <div className={`toolbar ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="toolbar-left">
        <button
          className="toolbar-button"
          onClick={handleNewProject}
          disabled={!driveState.initialized}
        >
          New Project
        </button>
      </div>
      <div className="toolbar-right">
        <span className="connection-status">
          {driveState.initialized ? '● Online' : '○ Offline'}
        </span>
      </div>
    </div>
  );
};

export default Toolbar;
