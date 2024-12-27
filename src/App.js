import React, { useRef, useEffect, useState } from 'react';
import './styles/App.css';
import Editor from './Components/Editor';
import Toolbar from './Components/Toolbar';
import { Rnd } from 'react-rnd';
import { EditorStateProvider } from './context/useEditorState';
import { GoogleDriveProvider } from './context/useGoogleDrive';

function App() {
  const editorRef = useRef(null); // Reference to the editor
  const [moduleSize, setModuleSize] = useState({ width: 800, height: 600 }); // Fallback size
  const [defaultPosition, setDefaultPosition] = useState({ x: 0, y: 0 }); // Fallback position

  useEffect(() => {
    console.log('Running useEffect to initialize module dimensions...');
    if (editorRef.current) {
      console.log('Editor reference found:', editorRef.current);
      const { offsetWidth, offsetHeight } = editorRef.current;

      const calculatedWidth = offsetWidth || 800;
      const calculatedHeight = offsetHeight || 600;

      const centerX = (window.innerWidth - calculatedWidth) / 2;
      const centerY = (window.innerHeight - calculatedHeight) / 2;

      setModuleSize({ width: calculatedWidth, height: calculatedHeight });
      setDefaultPosition({ x: centerX, y: centerY });
    } else {
      console.log('Editor reference not found, using default size and position.');
    }
  }, []);

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
