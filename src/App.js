import React, { useState, useEffect } from 'react';
import './styles/App.css';
import Editor from './Components/Editor';
import Toolbar from './Components/Toolbar';
import { Rnd } from 'react-rnd';
import { EditorStateProvider } from './context/useEditorState';
import { GoogleDriveProvider } from './context/useGoogleDrive';
import Journal from './Components/Journal';  // Import Journal component

function App() {
  const [moduleSize, setModuleSize] = useState({ width: 600, height: 800 }); // Default size for Editor module
  const [modulePosition, setModulePosition] = useState({ x: 0, y: 0 }); // Default position for Editor module

  useEffect(() => {
    // Calculate the center position based on the current window size for Editor module
    const calculateCenterPosition = () => {
      const centerX = (window.innerWidth - moduleSize.width) / 2;
      const centerY = (window.innerHeight - moduleSize.height) / 2;
      setModulePosition({ x: centerX, y: centerY });
    };

    // Initial calculation on mount
    calculateCenterPosition();

    // Recalculate position on window resize
    const handleResize = () => calculateCenterPosition();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize); // Cleanup on unmount
  }, [moduleSize]);

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
              position={modulePosition}
              onDragStop={(e, d) => {
                setModulePosition({ x: d.x, y: d.y });
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
              dragHandleClassName="drag-handle" // Restrict dragging to the handle
            >
              <div className="module-content" style={{ width: '100%', height: '100%' }}>
                <div className="drag-handle">
                  {/* Visible or invisible handle */}
                </div>
                <Editor />
              </div>
            </Rnd>

            {/* Journal Module */}
            <Journal /> {/* Add Journal component below the Editor */}
          </div>
        </div>
      </EditorStateProvider>
    </GoogleDriveProvider>
  );
}

export default App;
