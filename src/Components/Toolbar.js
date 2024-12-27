import React, { useState, useEffect } from 'react';
import { useEditorState } from '../context/useEditorState';
import { useGoogleDrive } from '../context/useGoogleDrive';
import '../styles/variables.css';
import '../styles/toolbar.css';

const Toolbar = () => {
    const { content } = useEditorState();
    const { saveFile, loadFile, driveState } = useGoogleDrive();
    const [isVisible, setIsVisible] = useState(true);
    const [projectName, setProjectName] = useState(''); // Store project name

    useEffect(() => {
        const handleMouseMove = (e) => {
            setIsVisible(e.clientY < 100);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const handleSave = async () => {
        try {
            await saveFile('sample-file-path.txt', content);
            alert('File saved to Google Drive!');
        } catch (error) {
            console.error('Error saving file:', error);
        }
    };

    const handleLoad = async () => {
        try {
            await loadFile('sample-file-path.txt');
            alert('File loaded from Google Drive!');
        } catch (error) {
            console.error('Error loading file:', error);
        }
    };

    const handleNewProject = () => {
        const name = prompt('Enter the name of your new project:'); // Prompt user for project name
        if (name) {
            setProjectName(name);
            alert(`New project created: ${name}`); // Placeholder for future integration
        }
    };

    return (
        <div className={`toolbar ${isVisible ? 'visible' : 'hidden'}`}>
            <div className="toolbar-left">
                <button className="toolbar-button" onClick={handleNewProject}>New Project</button>
                <button className="toolbar-button" onClick={handleSave}>Save</button>
                <button className="toolbar-button" onClick={handleLoad}>Load</button>
            </div>
            <div className="toolbar-right">
                <button className="toolbar-button stuck-button">I'm Stuck</button>
                <span className="connection-status">
                    {driveState?.initialized ? '● Online' : '○ Offline'}
                </span>
            </div>
        </div>
    );
};

export default Toolbar;
