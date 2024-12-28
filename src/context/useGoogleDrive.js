import { useReducer, useEffect, createContext, useContext } from "react";
import { saveProject as apiSaveProject, loadProject as apiLoadProject } from "../api";

const GoogleDriveContext = createContext();

export const useGoogleDrive = () => useContext(GoogleDriveContext);

const initialState = {
    initialized: false,
    authenticated: false,
    authenticate: null,
    logout: null,
    createProjectHierarchy: null,
    saveProject: null,
    loadProject: null,
};

const reducer = (state, action) => {
    switch (action.type) {
        case "INITIALIZE":
            return {
                ...state,
                initialized: true,
                authenticate: action.payload.authenticate,
                logout: action.payload.logout,
                createProjectHierarchy: action.payload.createProjectHierarchy,
                saveProject: action.payload.saveProject,
                loadProject: action.payload.loadProject,
            };
        case "AUTH_SUCCESS":
            return { ...state, authenticated: true };
        case "AUTH_FAIL":
            return { ...state, authenticated: false };
        default:
            console.warn(`[useGoogleDrive] Reducer received unknown action type: "${action.type}".`);
            return state;
    }
};

export const GoogleDriveProvider = ({ children }) => {
    const [driveState, dispatch] = useReducer(reducer, initialState);
    const BACKEND_URL = "https://scribe-backend-qe3m.onrender.com";

    useEffect(() => {
        // Parse query parameters to check authentication
        const params = new URLSearchParams(window.location.search);
        const isAuthenticated = params.get("auth") === "true";

        if (isAuthenticated) {
            console.log("[useGoogleDrive] Authentication successful.");
            localStorage.setItem("isAuthenticated", "true");
            dispatch({ type: "AUTH_SUCCESS" });
        } else {
            console.log("[useGoogleDrive] Authentication not detected.");
            localStorage.removeItem("isAuthenticated");
            dispatch({ type: "AUTH_FAIL" });
        }
    }, []);

    useEffect(() => {
        async function initializeDrive() {
            try {
                const authenticate = () => {
                    const redirectUrl = `${BACKEND_URL}/auth/google`;
                    console.log(`[useGoogleDrive] Redirecting to Google OAuth: ${redirectUrl}`);
                    window.location.href = redirectUrl;
                };

                const logout = () => {
                    localStorage.removeItem("isAuthenticated");
                    console.log("[useGoogleDrive] Logging out and resetting state.");
                    dispatch({ type: "AUTH_FAIL" });
                };

                const saveProject = async (projectName, content) => {
                    console.log(`[useGoogleDrive] Saving project: "${projectName}"`);
                    return await apiSaveProject(projectName, content);
                };

                const loadProject = async (projectName) => {
                    console.log(`[useGoogleDrive] Loading project: "${projectName}"`);
                    return await apiLoadProject(projectName);
                };

                dispatch({
                    type: "INITIALIZE",
                    payload: {
                        authenticate,
                        logout,
                        saveProject,
                        loadProject,
                    },
                });

                console.log("[useGoogleDrive] Drive initialized successfully.");
            } catch (error) {
                console.error("[useGoogleDrive] Initialization failed:", error);
                dispatch({ type: "AUTH_FAIL" });
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
