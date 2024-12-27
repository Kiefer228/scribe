import React, { useState, useEffect } from 'react';
import './styles/App.css';
import Editor from './Components/Editor';
import Toolbar from './Components/Toolbar';
import { Rnd } from 'react-rnd';
import { EditorStateProvider } from './context/useEditorState';
import { GoogleDriveProvider } from './context/useGoogleDrive';
import Journal from './Components/Journal';

function App() {
  const [moduleSize, setModuleSize] = useState({ width: 600, height: 800 }); // Default size for Editor module
  const [modulePosition, setModulePosition] = useState({ x: 0, y: 0 }); // Default position for Editor module

  useEffect(() => {
    const calculateCenterPosition = () => {
      const centerX = (window.innerWidth - moduleSize.width) / 2;
      const centerY = (window.innerHeight - moduleSize.height) / 2;
      setModulePosition({ x: centerX, y: centerY });
    };

    calculateCenterPosition();
    const handleResize = () => calculateCenterPosition();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
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
              dragHandleClassName="drag-handle"
            >
              <div className="module-content" style={{ width: '100%', height: '100%' }}>
                <div className="drag-handle" />
                <Editor />
              </div>
            </Rnd>

            {/* Journal Module */}
            <Rnd
              className="module"
              size={{ width: 600, height: 400 }} // Set default size for Journal
              position={{ x: 0, y: 100 }} // Position it below the Editor
              onDragStop={(e, d) => {
                // Handle drag position for Journal
              }}
              onResizeStop={(e, direction, ref) => {
                // Handle resizing for Journal
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
                <Journal />
              </div>
            </Rnd>
          </div>
        </div>
      </EditorStateProvider>
    </GoogleDriveProvider>
  );
}

export default App;
