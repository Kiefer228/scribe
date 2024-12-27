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
            {/* Editor Module */}
            <Rnd
              className="module"
              default={{
                width: 600,
                height: 800,
                x: 660,
                y: 100,
              }}
              bounds="parent"
              enableResizing={true} // Allow resizing from all directions
            >
              <div
                className="module-content"
                style={{
                  width: '100%',
                  height: '100%',
                }}
              >
                {/* Editor fills the entire module */}
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
