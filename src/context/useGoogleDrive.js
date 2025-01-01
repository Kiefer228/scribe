import { useReducer, createContext, useContext } from "react";

const GoogleDriveContext = createContext();

const initialState = {
    authenticated: false,
    initialized: false,
    errorMessage: "",
};

const reducer = (state, action) => {
    switch (action.type) {
        case "AUTH_SUCCESS":
            return { ...state, authenticated: true, errorMessage: "" };
        case "AUTH_FAIL":
            return { ...state, authenticated: false, errorMessage: action.payload };
        case "INITIALIZE":
            return { ...state, initialized: true };
        default:
            throw new Error(`[useGoogleDrive] Unknown action type: "${action.type}"`);
    }
};

export const useGoogleDrive = () => useContext(GoogleDriveContext);

export const GoogleDriveProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const authenticate = () => {
        console.log("[useGoogleDrive] Simulating authentication...");
        dispatch({ type: "AUTH_SUCCESS" });
    };

    const logout = () => {
        console.log("[useGoogleDrive] Simulating logout...");
        dispatch({ type: "AUTH_FAIL", payload: "User logged out successfully." });
    };

    const createProjectHierarchy = (projectName) => {
        if (!projectName) {
            throw new Error("Project name is required to create a hierarchy.");
        }
        console.log(`[useGoogleDrive] Simulating creation of project hierarchy for "${projectName}".`);
    };

    const saveProject = (projectName, content) => {
        if (!projectName || !content) {
            throw new Error("Project name and content are required.");
        }
        console.log(`[useGoogleDrive] Simulating saving project "${projectName}".`);
    };

    const loadProject = (projectName) => {
        if (!projectName) {
            throw new Error("Project name is required to load a project.");
        }
        console.log(`[useGoogleDrive] Simulating loading project "${projectName}".`);
        return `Sample content for project: ${projectName}`; // Simulated content
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
