import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import './styles/main.css';

function App() {
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

    const handleSidebarToggle = () => {
        setSidebarCollapsed(!isSidebarCollapsed);
    };

    return (
        <div className={`app-container ${isSidebarCollapsed ? 'collapsed' : ''}`}>
            <Sidebar isCollapsed={isSidebarCollapsed} onToggle={handleSidebarToggle} />
            <main className="editor-section">
                <Editor />
            </main>
        </div>
    );
}

export default App;
