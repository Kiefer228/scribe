import { useReducer, useEffect, createContext, useContext } from "react";
import crypto from "crypto-browserify";
import stream from "stream-browserify";
import {
    saveProject as apiSaveProject,
    loadProject as apiLoadProject,
    createProjectHierarchy as apiCreateProjectHierarchy,
    checkAuthStatus,
    initiateGoogleAuth,
} from "../api";

const GoogleDriveContext = createContext();
const SECRET_KEY = process.env.SECRET_KEY || "fallback-secret-key";

const validateSecretKey = (key) => {
    if (!key || key.length < 16) {
        throw new Error("SECRET_KEY must be at least 16 characters long and sufficiently complex.");
    }
};

validateSecretKey(SECRET_KEY);

const encryptToken = (token) => {
    const salt = crypto.randomBytes(16).toString("hex");
    const key = crypto.pbkdf2Sync(SECRET_KEY, salt, 1000, 32, "sha256");
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    let encrypted = cipher.update(token, "utf8", "hex");
    encrypted += cipher.final("hex");
    return JSON.stringify({ salt, iv: iv.toString("hex"), encrypted });
};

const decryptToken = (encryptedToken) => {
    try {
        const { salt, iv, encrypted } = JSON.parse(encryptedToken);
        const key = crypto.pbkdf2Sync(SECRET_KEY, salt, 1000, 32, "sha256");
        const decipher = crypto.createDecipheriv("aes-256-cbc", key, Buffer.from(iv, "hex"));
        let decrypted = decipher.update(encrypted, "hex", "utf8");
        decrypted += decipher.final("utf8");
        return decrypted;
    } catch (error) {
        console.error("[useGoogleDrive] Error decrypting token:", error.message);
        return null;
    }
};

export const useGoogleDrive = () => useContext(GoogleDriveContext);

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
            const friendlyMessage = action.payload.includes("expired")
                ? "Your session has expired. Please log in again."
                : action.payload.includes("network")
                ? "Network issue detected. Please check your connection and try again."
                : "Authentication failed.";
            return { ...state, authenticated: false, errorMessage: friendlyMessage };
        case "INITIALIZE":
            return { ...state, initialized: true };
        default:
            throw new Error(`[useGoogleDrive] Unknown action type: "${action.type}"`);
    }
};

let createHierarchyTimeout;

export const GoogleDriveProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const authenticate = () => {
        console.log("[useGoogleDrive] Redirecting to Google OAuth...");
        initiateGoogleAuth();
    };

    const logout = () => {
        console.log("[useGoogleDrive] Logging out and clearing local storage.");
        localStorage.removeItem("authToken");
        dispatch({ type: "AUTH_FAIL", payload: "User logged out successfully." });
    };

    const createProjectHierarchy = async (projectName) => {
        if (!projectName) {
            throw new Error("Project name is required to create a hierarchy.");
        }
        try {
            if (createHierarchyTimeout) {
                clearTimeout(createHierarchyTimeout);
            }
            createHierarchyTimeout = setTimeout(async () => {
                console.log(`[useGoogleDrive] Creating project hierarchy for "${projectName}".`);
                await apiCreateProjectHierarchy(projectName);
                createHierarchyTimeout = null;
            }, 500); // Increased debounce delay for more stability
        } catch (error) {
            console.error(`[useGoogleDrive] Error creating project hierarchy for "${projectName}":`, error.message);
            throw error;
        }
    };

    const validateProjectInputs = (projectName, content) => {
        if (!projectName || !content) {
            throw new Error("Project name and content are required.");
        }
    };

    const saveProject = async (projectName, content) => {
        validateProjectInputs(projectName, content);
        try {
            console.log(`[useGoogleDrive] Saving project "${projectName}".`);
            return await apiSaveProject(projectName, content);
        } catch (error) {
            console.error(`[useGoogleDrive] Error saving project "${projectName}":`, error.message);
            throw error;
        }
    };

    const loadProject = async (projectName) => {
        if (!projectName) {
            throw new Error("Project name is required to load a project.");
        }
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
