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
    authenticated: false,
    initialized: false,
};

const reducer = (state, action) => {
    switch (action.type) {
        case "AUTH_SUCCESS":
            return { ...state, authenticated: true };
        case "AUTH_FAIL":
            return { ...state, authenticated: false };
        case "INITIALIZE":
            return { ...state, initialized: true };
        default:
            console.warn(`[useGoogleDrive] Unknown action type: "${action.type}"`);
            return state;
    }
};

export const GoogleDriveProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        const validateTokenAndAuth = async () => {
            try {
                // Check for token in URL
                const urlParams = new URLSearchParams(window.location.search);
                const token = urlParams.get("token");

                if (token) {
                    console.log("[useGoogleDrive] Token found in URL. Saving to localStorage.");
                    localStorage.setItem("authToken", token);
                    window.history.replaceState({}, document.title, "/"); // Clean the URL
                    dispatch({ type: "AUTH_SUCCESS" });
                    return;
                }

                // Validate existing token
                const authStatus = await checkAuthStatus();
                if (authStatus.authenticated) {
                    console.log("[useGoogleDrive] User authenticated via backend.");
                    dispatch({ type: "AUTH_SUCCESS" });
                } else {
                    console.warn("[useGoogleDrive] User not authenticated.");
                    dispatch({ type: "AUTH_FAIL" });
                }
            } catch (error) {
                console.error("[useGoogleDrive] Error during authentication check:", error.message);
                dispatch({ type: "AUTH_FAIL" });
            }
        };

        validateTokenAndAuth();
    }, []);

    const authenticate = () => {
        console.log("[useGoogleDrive] Redirecting to Google OAuth...");
        initiateGoogleAuth();
    };

    const logout = () => {
        console.log("[useGoogleDrive] Logging out and clearing local storage.");
        localStorage.removeItem("authToken");
        dispatch({ type: "AUTH_FAIL" });
    };

    const createProjectHierarchy = async (projectName) => {
        try {
            console.log(`[useGoogleDrive] Creating project hierarchy for "${projectName}".`);
            return await apiCreateProjectHierarchy(projectName);
        } catch (error) {
            console.error(`[useGoogleDrive] Error creating project hierarchy for "${projectName}":`, error.message);
            throw error;
        }
    };

    const saveProject = async (projectName, content) => {
        try {
            console.log(`[useGoogleDrive] Saving project "${projectName}".`);
            return await apiSaveProject(projectName, content);
        } catch (error) {
            console.error(`[useGoogleDrive] Error saving project "${projectName}":`, error.message);
            throw error;
        }
    };

    const loadProject = async (projectName) => {
        try {
            console.log(`[useGoogleDrive] Loading project "${projectName}".`);
            return await apiLoadProject(projectName);
        } catch (error) {
            console.error(`[useGoogleDrive] Error loading project "${projectName}":`, error.message);
            throw error;
        }
    };

    return (
        <GoogleDriveContext.Provider
            value={{
                ...state,
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
