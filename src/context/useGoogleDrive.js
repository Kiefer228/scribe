import { useState, useEffect, createContext, useContext } from 'react';

const GoogleDriveContext = createContext();

export const useGoogleDrive = () => {
    return useContext(GoogleDriveContext);
};

export const GoogleDriveProvider = ({ children }) => {
    const [driveState, setDriveState] = useState(null);

    const BACKEND_URL = "https://scribe-backend-qe3m.onrender.com";

    useEffect(() => {
        async function initializeDrive() {
            try {
                // Placeholder for Google Drive API initialization
                setDriveState({ initialized: true });

                // Example API calls for backend integration
                async function authenticate() {
                    console.log("Initiating authentication...");
                    try {
                        const response = await fetch(`${BACKEND_URL}/api/auth`);
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        const data = await response.json();
                        window.location.href = data.authUrl; // Redirect to Google auth URL
                    } catch (error) {
                        console.error('Authentication failed:', error);
                    }
                }

                async function setupDrive() {
                    console.log("Setting up Google Drive...");
                    try {
                        const response = await fetch(`${BACKEND_URL}/api/setup`, { method: 'POST' });
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        const data = await response.json();
                        console.log('Drive setup completed:', data);
                    } catch (error) {
                        console.error('Setup failed:', error);
                    }
                }

                async function saveProject(projectName, content) {
                    try {
                        const response = await fetch(`${BACKEND_URL}/api/project/save`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ projectName, fileContent: content }),
                        });
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        const data = await response.json();
                        console.log('Project saved:', data);
                    } catch (error) {
                        console.error('Save failed:', error);
                    }
                }

                async function loadProject(projectName) {
                    try {
                        const response = await fetch(`${BACKEND_URL}/api/project/load?projectName=${projectName}`);
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        const data = await response.json();
                        console.log('Project loaded:', data);
                        return data;
                    } catch (error) {
                        console.error('Load failed:', error);
                    }
                }

                // Expose these functions to the context state
                setDriveState({
                    initialized: true,
                    authenticate,
                    setupDrive,
                    saveProject,
                    loadProject,
                });
            } catch (error) {
                console.error('Drive initialization failed:', error);
            }
        }
        initializeDrive();
    }, []);

    return (
        <GoogleDriveContext.Provider value={driveState}>
            {children}
        </GoogleDriveContext.Provider>
    );
};
