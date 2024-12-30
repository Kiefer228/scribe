import { useReducer, useEffect, createContext, useContext } from "react";
import {
    saveProject as apiSaveProject,
    loadProject as apiLoadProject,
    createProjectHierarchy as apiCreateProjectHierarchy,
    checkAuthStatus,
    initiateGoogleAuth,
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

    useEffect(() => {
        const validateAuthStatus = async () => {
            try {
                const response = await checkAuthStatus();
                if (response.authenticated) {
                    console.log("[useGoogleDrive] Backend authentication successful.");
                    dispatch({ type: "AUTH_SUCCESS" });
                } else {
                    console.warn("[useGoogleDrive] Backend authentication failed.");
                    dispatch({ type: "AUTH_FAIL" });
                }
            } catch (error) {
                console.error("[useGoogleDrive] Error validating auth status:", error.message);
                dispatch({ type: "AUTH_FAIL" });
            }
        };

        // Check for tokens in the URL (OAuth callback)
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");
        if (token) {
            console.log("[useGoogleDrive] Token found in URL. Saving to localStorage.");
            localStorage.setItem("authToken", token);
            window.history.replaceState({}, document.title, "/"); // Clean URL
            dispatch({ type: "AUTH_SUCCESS" });
        } else {
            validateAuthStatus(); // Validate existing token
        }
    }, []);

    const authenticate = () => {
        console.log("[useGoogleDrive] Redirecting to Google OAuth...");
        initiateGoogleAuth();
    };

    const logout = () => {
        console.log("[useGoogleDrive] Logging out user and clearing local state...");
        localStorage.removeItem("authToken");
        dispatch({ type: "AUTH_FAIL" });
    };

    const createProjectHierarchy = async (projectName) => {
        try {
            return await apiCreateProjectHierarchy(projectName);
        } catch (error) {
            console.error(`[useGoogleDrive] Error creating project hierarchy for "${projectName}":`, error.message);
            throw error;
        }
    };

    const saveProject = async (projectName, content) => {
        try {
            return await apiSaveProject(projectName, content);
        } catch (error) {
            console.error(`[useGoogleDrive] Error saving project "${projectName}":`, error.message);
            throw error;
        }
    };

    const loadProject = async (projectName) => {
        try {
            return await apiLoadProject(projectName);
        } catch (error) {
            console.error(`[useGoogleDrive] Error loading project "${projectName}":`, error.message);
            throw error;
        }
    };

    useEffect(() => {
        console.log("[useGoogleDrive] State initialized:", driveState);
    }, [driveState]);

    return (
        <GoogleDriveContext.Provider
            value={{
                ...driveState,
                authenticate,
                logout,
                createProjectHierarchy,
                saveProject,
                loadProject,
            }}
        >
            {children}
        </GoogleDriveContext.Provider>
    );
};
