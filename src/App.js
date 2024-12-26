import React from 'react';
import Editor from './components/Editor';
import Toolbar from './components/Toolbar';
import { EditorStateProvider } from './context/useEditorState';
import { GoogleDriveProvider } from './context/useGoogleDrive';
import './styles/variables.css';
import './styles/main.css';

const App = () => {
    return (
        <GoogleDriveProvider>
            <EditorStateProvider>
                <div className="app-container">
                    <Toolbar />
                    <main className="editor-section">
                        <Editor />
                    </main>
                </div>
            </EditorStateProvider>
        </GoogleDriveProvider>
    );
};

export default App;