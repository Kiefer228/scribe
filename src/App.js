import React from 'react';
import './styles/App.css';
import Editor from './Components/Editor';
import Toolbar from './Components/Toolbar';
import { Rnd } from 'react-rnd';

import { EditorStateProvider } from './context/useEditorState';

function App() {
  return (
    <EditorStateProvider>
      <div className="App">
        <Toolbar />
        <div className="desktop-layout">
          <Rnd
            className="module editor"
            default={{ x: 300, y: 100, width: 800, height: 600 }}
          >
            <Editor />
          </Rnd>
          {/* Additional panels can be added here */}
        </div>
      </div>
    </EditorStateProvider>
  );
}

export default App;
