import React, { useState, useEffect } from 'react';
import { useEditorState } from '../context/useEditorState';
import { useGoogleDrive } from '../context/useGoogleDrive';
import '../styles/variables.css';
import '../styles/toolbar.css';

const Toolbar = () => {
    const driveState = useGoogleDrive();

    const handleAuthenticate = () => {
        if (driveState?.authenticate) {
            driveState.authenticate();
        } else {
            console.error("Google Drive is not initialized.");
        }
    };

    const handleSetupDrive = () => {
        if (driveState?.setupDrive) {
            driveState.setupDrive();
        } else {
            console.error("Google Drive is not initialized.");
        }
    };

    const handleSaveProject = () => {
        if (driveState?.saveProject) {
            const projectName = prompt("Enter project name to save:");
            const content = "Sample content to save"; // Replace with actual editor content
            driveState.saveProject(projectName, content);
        } else {
            console.error("Google Drive is not initialized.");
        }
    };

    const handleLoadProject = async () => {
        if (driveState?.loadProject) {
            const projectName = prompt("Enter project name to load:");
            const data = await driveState.loadProject(projectName);
            console.log("Loaded Project Content:", data); // Replace with logic to update the editor
        } else {
            console.error("Google Drive is not initialized.");
        }
    };

    return (
        <div className="toolbar">
            <button onClick={handleAuthenticate}>Authenticate</button>
            <button onClick={handleSetupDrive}>Setup Drive</button>
            <button onClick={handleSaveProject}>Save</button>
            <button onClick={handleLoadProject}>Load</button>
        </div>
    );
};

export default Toolbar;
