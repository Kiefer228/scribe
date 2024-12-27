import { useReducer, useEffect, createContext, useContext } from "react";

const GoogleDriveContext = createContext();

export const useGoogleDrive = () => useContext(GoogleDriveContext);

const initialState = {
    initialized: false,
    authenticate: null,
    createProjectHierarchy: null,
};

const reducer = (state, action) => {
    switch (action.type) {
        case "INITIALIZE":
            console.log("Reducer: INITIALIZE action received.");
            return {
                initialized: true,
                authenticate: action.payload.authenticate,
                createProjectHierarchy: action.payload.createProjectHierarchy,
            };
        case "FAIL":
            console.log("Reducer: FAIL action received.");
            return {
                initialized: false,
                authenticate: () => console.error("Google Drive initialization failed."),
                createProjectHierarchy: () => console.error("Google Drive initialization failed."),
            };
        default:
            console.warn(`Reducer: Unknown action type "${action.type}" received.`);
            return state;
    }
};

export const GoogleDriveProvider = ({ children }) => {
    const [driveState, dispatch] = useReducer(reducer, initialState);

    const BACKEND_URL = "https://scribe-backend-qe3m.onrender.com";

    useEffect(() => {
        async function initializeDrive() {
            console.log("[useGoogleDrive] Starting initialization...");

            try {
                const createProjectHierarchy = async (projectName) => {
                    console.log(`[useGoogleDrive] Attempting to create project hierarchy: "${projectName}"`);
                    const response = await fetch(`${BACKEND_URL}/api/project/createHierarchy`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ projectName }),
                    });

                    if (!response.ok) {
                        const errorMessage = `[useGoogleDrive] HTTP error during project creation! Status: ${response.status}`;
                        console.error(errorMessage);
                        throw new Error(errorMessage);
                    }

                    const data = await response.json();
                    console.log("[useGoogleDrive] Project hierarchy created successfully:", data);
                    return data;
                };

                dispatch({
                    type: "INITIALIZE",
                    payload: {
                        authenticate: () => {
                            const redirectUrl = `${BACKEND_URL}/auth/google`;
                            console.log(`[useGoogleDrive] Redirecting to Google OAuth: ${redirectUrl}`);
                            window.location.href = redirectUrl;
                        },
                        createProjectHierarchy,
                    },
                });

                console.log("[useGoogleDrive] Google Drive initialized successfully.");
            } catch (error) {
                console.error("[useGoogleDrive] Drive initialization failed:", error);
                dispatch({ type: "FAIL" });
            }
        }

        initializeDrive();
    }, []);

    useEffect(() => {
        console.log("[useGoogleDrive] Current Drive State:", driveState);
    }, [driveState]);

    return (
        <GoogleDriveContext.Provider value={driveState}>
            {children}
        </GoogleDriveContext.Provider>
    );
};
