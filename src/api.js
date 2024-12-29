const API_BASE_URL = "https://scribe-backend-qe3m.onrender.com";

// Helper: Fetch with authentication
const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem("isAuthenticated");
    if (!token) {
        throw new Error("User not authenticated");
    }

    const headers = {
        ...options.headers,
        "Content-Type": "application/json", // Ensure content type for JSON requests
    };

    console.log(`[fetchWithAuth] Requesting: ${API_BASE_URL}${url}`, options);

    try {
        const response = await fetch(`${API_BASE_URL}${url}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const errorMessage = `HTTP error: ${response.status}`;
            console.error(`[fetchWithAuth] ${errorMessage}`);
            throw new Error(errorMessage);
        }

        const data = await response.json();
        console.log(`[fetchWithAuth] Success:`, data);
        return data;
    } catch (error) {
        console.error("[fetchWithAuth] Network or server error:", error.message);
        throw error;
    }
};

// Redirect to Google Authentication
export const initiateGoogleAuth = async () => {
    console.log("[initiateGoogleAuth] Redirecting to Google OAuth...");
    window.location.href = `${API_BASE_URL}/auth/google`;
};

// Check authentication status
export const checkAuthStatus = async () => {
    try {
        console.log("[checkAuthStatus] Checking authentication status...");
        return await fetchWithAuth("/auth/status", { method: "GET" });
    } catch (error) {
        console.error("[checkAuthStatus] Error:", error.message);
        throw error;
    }
};

// Save a project to the backend
export const saveProject = async (projectName, content) => {
    if (!projectName || !content) {
        throw new Error("Project name and content are required to save a project.");
    }

    const url = `/api/project/save`;
    const body = JSON.stringify({ projectName, content });

    try {
        console.log(`[saveProject] Saving project "${projectName}"...`);
        return await fetchWithAuth(url, { method: "POST", body });
    } catch (error) {
        console.error("[saveProject] Error:", error.message);
        throw error;
    }
};

// Load a project from the backend
export const loadProject = async (projectName) => {
    if (!projectName) {
        console.log("[loadProject] No project name provided. Attempting to load the first available project...");
        return null; // No project name indicates no projects available
    }

    const url = `/api/project/load?projectName=${encodeURIComponent(projectName)}`;
    try {
        console.log(`[loadProject] Loading project "${projectName}"...`);
        const data = await fetchWithAuth(url, { method: "GET" });
        return data.content;
    } catch (error) {
        console.error("[loadProject] Error:", error.message);
        throw error;
    }
};

// Create a project hierarchy
export const createProjectHierarchy = async (projectName) => {
    if (!projectName) {
        throw new Error("Project name is required to create a hierarchy.");
    }

    const url = `/api/project/createHierarchy`;
    const body = JSON.stringify({ projectName });

    try {
        console.log(`[createProjectHierarchy] Creating hierarchy for project "${projectName}"...`);
        return await fetchWithAuth(url, { method: "POST", body });
    } catch (error) {
        console.error("[createProjectHierarchy] Error creating project hierarchy:", error.message);
        throw error;
    }
};
