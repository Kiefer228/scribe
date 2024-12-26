import React from 'react';
import { EditorStateProvider } from './context/useEditorState'; // Import the provider
import Editor from './components/Editor';
import Sidebar from './components/Sidebar';
import './styles/main.css';

function App() {
    return (
        <EditorStateProvider> {/* Wrap the app in the context provider */}
            <div className="app-container">
                {/* Sidebar for metadata and summaries */}
                <Sidebar />

                {/* Main editor component */}
                <main className="editor-section">
                    <Editor />
                </main>
            </div>
        </EditorStateProvider>
    );
}

export default App;
