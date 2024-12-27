import React, { useRef, useEffect, useState } from 'react';
import './styles/App.css';
import Editor from './Components/Editor';
import Toolbar from './Components/Toolbar';
import { Rnd } from 'react-rnd';
import { EditorStateProvider } from './context/useEditorState';
import { GoogleDriveProvider } from './context/useGoogleDrive';

function App() {
  const editorRef = useRef(null); // Reference to the editor
  const [moduleSize, setModuleSize] = useState({ width: 600, height: 800 }); // Default size
  const [defaultPosition, setDefaultPosition] = useState({ x: 0, y: 0 }); // Default position

  useEffect(() => {
    // Calculate center of the screen based on window size and module dimensions
    const calculateCenterPosition = () => {
      const centerX = (window.innerWidth - moduleSize.width) / 2;
      const centerY = (window.innerHeight - moduleSize.height) / 2;
      setDefaultPosition({ x: centerX, y: centerY });
    };

    // Initial calculation on mount
    calculateCenterPosition();

    // Recalculate on window resize
    const handleResize = () => calculateCenterPosition();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize); // Cleanup
  }, [moduleSize.width, moduleSize.height]);

  return (
    <GoogleDriveProvider>
      <EditorStateProvider>
        <div className="App">
          <Toolbar />
          <div className="desktop-layout">
            <Rnd
              className="module"
              size={{
                width: moduleSize.width,
                height: moduleSize.height,
              }}
              default={{
                x: defaultPosition.x,
                y: defaultPosition.y,
              }}
              onResizeStop={(e, direction, ref) => {
                // Update size on resize stop
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
              <div
                className="module-content"
                ref={editorRef}
                style={{
                  width: '100%',
                  height: '100%',
                }}
              >
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
