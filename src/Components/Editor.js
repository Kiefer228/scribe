import React from 'react';
import { useEditorState } from '../context/useEditorState';
import { useGoogleDrive } from '../context/useGoogleDrive';
import '../styles/editor.css';

const Editor = () => {
    const driveState = useGoogleDrive();
    const { content, updateContent } = useEditorState();

    const saveContent = () => {
        if (driveState?.saveProject) {
            const projectName = prompt("Enter project name to save:");
            const contentToSave = content || "Default content"; // Replace with actual editor content
            driveState.saveProject(projectName, contentToSave);
        } else {
            console.error("Google Drive is not initialized.");
        }
    };

    const loadContent = async () => {
        if (driveState?.loadProject) {
            const projectName = prompt("Enter project name to load:");
            const data = await driveState.loadProject(projectName);
            if (data) {
                updateContent(data); // Update the editor with the loaded content
            }
        } else {
            console.error("Google Drive is not initialized.");
        }
    };

    return (
        <div>
            <div className="editor-toolbar">
                <button onClick={saveContent}>Save</button>
                <button onClick={loadContent}>Load</button>
            </div>
            <div className="editor-container">
                <textarea
                    className="editor-textarea"
                    value={content}
                    onChange={(e) => updateContent(e.target.value)}
                    placeholder="Start writing here..."
                />
            </div>
        </div>
    );
};

export default Editor;
