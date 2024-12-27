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
            return {
                initialized: true,
                authenticate: action.payload.authenticate,
                createProjectHierarchy: action.payload.createProjectHierarchy,
            };
        case "FAIL":
            return {
                initialized: false,
                authenticate: () => console.error("Google Drive initialization failed."),
                createProjectHierarchy: () => console.error("Google Drive initialization failed."),
            };
        default:
            return state;
    }
};

export const GoogleDriveProvider = ({ children }) => {
    const [driveState, dispatch] = useReducer(reducer, initialState);

    const BACKEND_URL = "https://scribe-backend-qe3m.onrender.com";

    useEffect(() => {
        async function initializeDrive() {
            try {
                console.log("Initializing Google Drive...");

                const createProjectHierarchy = async (projectName) => {
                    console.log(`Creating project hierarchy: ${projectName}`);
                    const response = await fetch(`${BACKEND_URL}/api/project/createHierarchy`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ projectName }),
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }

                    const data = await response.json();
                    console.log("Project hierarchy created successfully:", data);
                    return data;
                };

                dispatch({
                    type: "INITIALIZE",
                    payload: {
                        authenticate: () => {
                            console.log("Redirecting to Google OAuth...");
                            window.location.href = `${BACKEND_URL}/auth/google`;
                        },
                        createProjectHierarchy,
                    },
                });

                console.log("Google Drive initialized successfully.");
            } catch (error) {
                console.error("Drive initialization failed:", error);
                dispatch({ type: "FAIL" });
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
