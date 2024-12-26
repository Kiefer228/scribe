import React, { useState } from 'react';
import { useGoogleDrive } from '../context/useGoogleDrive';
import '../styles/sidebar.css';

const Sidebar = ({ isCollapsed, onToggle }) => {
    const { saveFile, loadFile, driveState } = useGoogleDrive();
    const [fileContent, setFileContent] = useState('');

    const handleSave = async () => {
        try {
            await saveFile('sample-file-path.txt', fileContent);
            alert('File saved to Google Drive!');
        } catch (error) {
            console.error('Error saving file:', error);
        }
    };

    const handleLoad = async () => {
        try {
            const content = await loadFile('sample-file-path.txt');
            setFileContent(content);
            alert('File loaded from Google Drive!');
        } catch (error) {
            console.error('Error loading file:', error);
        }
    };

    return (
        <>
            {/* Toggle Button - Always Visible */}
            <button className="sidebar-toggle" onClick={onToggle}>
                {isCollapsed ? '☰' : '×'}
            </button>
            <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
                {!isCollapsed && (
                    <>
                        <h2>Google Drive Integration</h2>
                        <p>Status: {driveState?.initialized ? 'Connected' : 'Disconnected'}</p>
                        <textarea
                            className="file-content"
                            value={fileContent}
                            onChange={(e) => setFileContent(e.target.value)}
                            placeholder="Edit your content here..."
                        />
                        <button className="sidebar-button" onClick={handleSave}>
                            Save to Drive
                        </button>
                        <button className="sidebar-button" onClick={handleLoad}>
                            Load from Drive
                        </button>
                    </>
                )}
            </div>
        </>
    );
};

export default Sidebar;
