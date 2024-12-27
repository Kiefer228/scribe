import React, { useRef, useEffect, useState } from 'react';
import './styles/App.css';
import Editor from './Components/Editor';
import Toolbar from './Components/Toolbar';
import { Rnd } from 'react-rnd';
import { EditorStateProvider } from './context/useEditorState';
import { GoogleDriveProvider } from './context/useGoogleDrive';

function App() {
  const editorRef = useRef(null); // Reference to the editor
  const [moduleSize, setModuleSize] = useState({ width: 800, height: 600 });

  useEffect(() => {
    // On mount, adjust the module size to match the editor's content size
    if (editorRef.current) {
      const { scrollWidth, scrollHeight } = editorRef.current;
      setModuleSize({
        width: scrollWidth,
        height: scrollHeight,
      });
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
              onResizeStop={(e, direction, ref) => {
                // Update the module size after resizing
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
