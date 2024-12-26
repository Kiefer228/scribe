import React from 'react';
import Editor from './components/Editor';
import Sidebar from './components/Sidebar';

function App() {
    return (
        <div className="app-container">
            <Sidebar />
            <Editor />
        </div>
    );
}

export default App;
