import React, { useRef, useEffect, useState } from 'react';
import './styles/App.css';
import Editor from './Components/Editor';
import Toolbar from './Components/Toolbar';
import { Rnd } from 'react-rnd';
import { EditorStateProvider } from './context/useEditorState';
import { GoogleDriveProvider } from './context/useGoogleDrive';

function App() {
  const editorRef = useRef(null); // Reference to the editor
  const [moduleSize, setModuleSize] = useState(null);
  const [defaultPosition, setDefaultPosition] = useState(null);

  useEffect(() => {
    if (editorRef.current) {
      const { offsetWidth = 800, offsetHeight = 600 } = editorRef.current;

      // Calculate center of the screen
      const centerX = (window.innerWidth - offsetWidth) / 2;
      const centerY = (window.innerHeight - offsetHeight) / 2;

      // Set size and position
      setModuleSize({ width: offsetWidth, height: offsetHeight });
      setDefaultPosition({ x: centerX, y: centerY });
    }
  }, []);

  // Wait until size and position are calculated
  if (!moduleSize || !defaultPosition) {
    return null; // Prevent rendering until size and position are ready
  }

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
