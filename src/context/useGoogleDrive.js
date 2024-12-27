import { useState, useEffect, createContext, useContext } from 'react';

const GoogleDriveContext = createContext();

// Hook to access Google Drive context
export const useGoogleDrive = () => {
    return useContext(GoogleDriveContext);
};

export const GoogleDriveProvider = ({ children }) => {
    const [driveState, setDriveState] = useState({
        initialized: false,
        authenticate: () => console.error("Google Drive not initialized."),
        createProjectHierarchy: () => console.error("Google Drive not initialized."),
    });

    const BACKEND_URL = "https://scribe-backend-qe3m.onrender.com";

    useEffect(() => {
        async function initializeDrive() {
            try {
                console.log("Initializing Google Drive...");
                setDriveState((prevState) => ({
                    ...prevState,
                    initialized: true,
                }));

                // Define the functions only after initialization
                async function authenticate() {
                    console.log("Initiating authentication...");
                    try {
                        const response = await fetch(`${BACKEND_URL}/auth/google`);
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        window.location.href = response.url; // Redirect to Google OAuth URL
                    } catch (error) {
                        console.error("Authentication failed:", error);
                    }
                }

                async function createProjectHierarchy(projectName) {
                    try {
                        console.log("Creating project hierarchy...");
                        const response = await fetch(`${BACKEND_URL}/api/project/createHierarchy`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ projectName }),
                        });
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        const data = await response.json();
                        console.log("Project hierarchy created:", data);
                        return data;
                    } catch (error) {
                        console.error("Failed to create project hierarchy:", error);
                        throw error;
                    }
                }

                // Update the state with actual functions
                setDriveState({
                    initialized: true,
                    authenticate,
                    createProjectHierarchy,
                });
            } catch (error) {
                console.error("Drive initialization failed:", error);
                setDriveState({
                    initialized: false,
                    authenticate: () => console.error("Google Drive initialization failed."),
                    createProjectHierarchy: () => console.error("Google Drive initialization failed."),
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
