import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import { EditorStateProvider } from './context/useEditorState';
import './styles/main.css';

function App() {
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(true); // Default state is collapsed

    const handleSidebarToggle = () => {
        setSidebarCollapsed(!isSidebarCollapsed);
    };

    return (
        <EditorStateProvider>
            <div className={`app-container ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                <Sidebar isCollapsed={isSidebarCollapsed} onToggle={handleSidebarToggle} />
                <main className="editor-section">
                    <Editor />
                </main>
            </div>
        </EditorStateProvider>
    );
}

export default App;
