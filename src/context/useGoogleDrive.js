import { useState, useEffect, createContext, useContext } from 'react';

const GoogleDriveContext = createContext();

export const useGoogleDrive = () => {
    return useContext(GoogleDriveContext);
};

export const GoogleDriveProvider = ({ children }) => {
    const [driveState, setDriveState] = useState({
        initialized: false,
        authenticate: () => console.error("Google Drive not initialized."),
        setupDrive: () => console.error("Google Drive not initialized."),
        saveProject: () => console.error("Google Drive not initialized."),
        loadProject: () => console.error("Google Drive not initialized."),
    });

    const BACKEND_URL = "https://scribe-backend-qe3m.onrender.com";

    useEffect(() => {
        async function initializeDrive() {
            try {
                setDriveState(prevState => ({
                    ...prevState,
                    initialized: true,
                }));

                // Backend API functions
                async function authenticate() {
                    console.log("Initiating authentication...");
                    try {
                        const response = await fetch(`${BACKEND_URL}/api/auth`);
                        console.log("Response:", response);
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        const data = await response.json();
                        console.log("Auth URL:", data.authUrl);
                        window.location.href = data.authUrl; // Redirect to Google OAuth URL
                    } catch (error) {
                        console.error("Authentication failed:", error);
                    }
                }

                async function setupDrive() {
                    console.log("Setting up Google Drive...");
                    try {
                        const response = await fetch(`${BACKEND_URL}/api/setup`, { method: "POST" });
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        const data = await response.json();
                        console.log("Drive setup completed:", data);
                    } catch (error) {
                        console.error("Setup failed:", error);
                    }
                }

                async function saveProject(projectName, content) {
                    try {
                        const response = await fetch(`${BACKEND_URL}/api/project/save`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ projectName, fileContent: content }),
                        });
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        const data = await response.json();
                        console.log("Project saved:", data);
                    } catch (error) {
                        console.error("Save failed:", error);
                    }
                }

                async function loadProject(projectName) {
                    try {
                        const response = await fetch(`${BACKEND_URL}/api/project/load?projectName=${projectName}`);
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        const data = await response.json();
                        console.log("Project loaded:", data);
                        return data;
                    } catch (error) {
                        console.error("Load failed:", error);
                    }
                }

                // Update the context with actual functions when initialized
                setDriveState({
                    initialized: true,
                    authenticate,
                    setupDrive,
                    saveProject,
                    loadProject,
                });
            } catch (error) {
                console.error("Drive initialization failed:", error);
                // Set a default fallback value
                setDriveState({
                    initialized: false,
                    authenticate: () => console.error("Google Drive initialization failed."),
                    setupDrive: () => console.error("Google Drive initialization failed."),
                    saveProject: () => console.error("Google Drive initialization failed."),
                    loadProject: () => console.error("Google Drive initialization failed."),
                });
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
