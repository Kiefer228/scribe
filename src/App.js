import React, { useRef, useEffect, useState } from 'react';
import './styles/App.css';
import Editor from './Components/Editor';
import Toolbar from './Components/Toolbar';
import { Rnd } from 'react-rnd';
import { EditorStateProvider } from './context/useEditorState';
import { GoogleDriveProvider } from './context/useGoogleDrive';

function App() {
  const [moduleSize, setModuleSize] = useState({ width: 800, height: 600 });
  const editorRef = useRef(null);

  useEffect(() => {
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
              className="module editor"
              size={{
                width: moduleSize.width,
                height: moduleSize.height,
              }}
              disableDragging={false}
              enableResizing={false} // Disable resizing
              bounds="parent" // Restrict movement within parent container
            >
              <div ref={editorRef}>
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
