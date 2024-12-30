import { useReducer, useEffect, createContext, useContext } from "react";
import {
    saveProject as apiSaveProject,
    loadProject as apiLoadProject,
    createProjectHierarchy as apiCreateProjectHierarchy,
    checkAuthStatus,
} from "../api";

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
        const validateAuthStatus = async () => {
            try {
                const response = await checkAuthStatus();
                if (response.authenticated) {
                    console.log("[useGoogleDrive] Backend authentication successful.");
                    dispatch({ type: "AUTH_SUCCESS" });
                } else {
                    console.log("[useGoogleDrive] Backend authentication failed. Redirecting to login.");
                    localStorage.removeItem("isAuthenticated");
                    dispatch({ type: "AUTH_FAIL" });
                }
            } catch (error) {
                console.error("[useGoogleDrive] Error checking auth status:", error);
                dispatch({ type: "AUTH_FAIL" });
            }
        };

        validateAuthStatus();
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

                const createProjectHierarchy = async (projectName) => {
                    if (!projectName) {
                        throw new Error("Project name is required for creating a hierarchy.");
                    }
                    console.log(`[useGoogleDrive] Creating project hierarchy: "${projectName}"`);
                    return await apiCreateProjectHierarchy(projectName);
                };

                const saveProject = async (projectName, content) => {
                    if (!projectName || !content) {
                        throw new Error("Project name and content are required for saving.");
                    }
                    console.log(`[useGoogleDrive] Saving project: "${projectName}"`);
                    return await apiSaveProject(projectName, content);
                };

                const loadProject = async (projectName) => {
                    if (!projectName) {
                        console.log("[useGoogleDrive] No project name provided. Attempting to load the first available project.");
                        return null; // Indicates no project to load
                    }
                    console.log(`[useGoogleDrive] Loading project: "${projectName}"`);
                    return await apiLoadProject(projectName);
                };

                dispatch({
                    type: "INITIALIZE",
                    payload: {
                        authenticate,
                        logout,
                        createProjectHierarchy,
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
