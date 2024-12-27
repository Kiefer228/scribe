import { useState, useEffect, createContext, useContext } from "react";

const GoogleDriveContext = createContext();

export const useGoogleDrive = () => useContext(GoogleDriveContext);

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

                // Backend API: Create project hierarchy
                const createProjectHierarchy = async (projectName) => {
                    console.log(`Creating project hierarchy: ${projectName}`);
                    try {
                        const response = await fetch(`${BACKEND_URL}/api/project/createHierarchy`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ projectName }),
                        });

                        if (!response.ok) {
                            const errorMessage = `HTTP error! Status: ${response.status}`;
                            console.error(errorMessage);
                            throw new Error(errorMessage);
                        }

                        const data = await response.json();
                        console.log("Project hierarchy created successfully:", data);
                        return data;
                    } catch (error) {
                        console.error("Error creating project hierarchy:", error);
                        throw error;
                    }
                };

                // Set the drive state with real functions and mark as initialized
                setDriveState({
                    initialized: true,
                    authenticate: () => {
                        window.location.href = `${BACKEND_URL}/auth/google`; // Redirect to backend Google OAuth
                    },
                    createProjectHierarchy,
                });

                console.log("Google Drive initialized successfully.");
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
