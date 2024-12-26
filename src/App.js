import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import { EditorStateProvider } from './context/useEditorState';
import { GoogleDriveProvider } from './context/useGoogleDrive';
import './styles/main.css';

function App() {
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(true); // Default state is collapsed

    const handleSidebarToggle = () => {
        setSidebarCollapsed(!isSidebarCollapsed);
    };

    return (
        <GoogleDriveProvider> {/* Wrap the app with the Google Drive context */}
            <EditorStateProvider>
                <div className={`app-container ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                    <Sidebar isCollapsed={isSidebarCollapsed} onToggle={handleSidebarToggle} />
                    <main className="editor-section">
                        <Editor />
                    </main>
                </div>
            </EditorStateProvider>
        </GoogleDriveProvider>
    );
}

export default App;
