import React from 'react';
import './styles/App.css';
import Editor from './Components/Editor';
import Toolbar from './Components/Toolbar';
import { Rnd } from 'react-rnd';
import { EditorStateProvider } from './context/useEditorState';
import { GoogleDriveProvider } from './context/useGoogleDrive';

function App() {
  return (
    <GoogleDriveProvider>
      <EditorStateProvider>
        <div className="App">
          <Toolbar />
          <div className="desktop-layout">
            <Rnd
              className="module editor"
              default={{
                x: 300,
                y: 100,
                width: 800,
                height: 600,
              }}
              disableDragging={false}
              enableResizing={false} // Disable resizing
              bounds="parent" // Restrict movement within parent container
            >
              <Editor />
            </Rnd>
            {/* Additional fixed-size panels can be added here */}
          </div>
        </div>
      </EditorStateProvider>
    </GoogleDriveProvider>
  );
}

export default App;
