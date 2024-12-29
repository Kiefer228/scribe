const API_BASE_URL = "https://scribe-backend-qe3m.onrender.com";

// Helper: Fetch with authentication
const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem("isAuthenticated");
    if (!token) {
        console.error("[fetchWithAuth] User not authenticated");
        throw new Error("User not authenticated");
    }

    const headers = {
        ...options.headers,
        ...(options.method && options.method !== "GET" && { "Content-Type": "application/json" }), // Add Content-Type for non-GET requests
    };

    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        console.error(`[fetchWithAuth] HTTP error: ${response.status}`);
        throw new Error(`HTTP error: ${response.status}`);
    }

    return response.json();
};

// Redirect to Google Authentication
export const initiateGoogleAuth = async () => {
    console.log("[initiateGoogleAuth] Redirecting to Google OAuth...");
    window.location.href = `${API_BASE_URL}/auth/google`;
};

// Check authentication status
export const checkAuthStatus = async () => {
    try {
        return await fetchWithAuth("/auth/status", { method: "GET" });
    } catch (error) {
        console.error("[checkAuthStatus] Error checking authentication status:", error);
        throw error;
    }
};

// Save a project to the backend
export const saveProject = async (projectName, content) => {
    if (!projectName || !content) {
        console.error("[saveProject] Missing project name or content.");
        throw new Error("Project name and content are required.");
    }

    try {
        const url = `/api/project/save`;
        const body = JSON.stringify({ projectName, content });
        console.log(`[saveProject] Saving project "${projectName}"...`);
        return await fetchWithAuth(url, { method: "POST", body });
    } catch (error) {
        console.error("[saveProject] Error saving project:", error);
        throw error;
    }
};

// Load a project from the backend
export const loadProject = async (projectName) => {
    if (!projectName) {
        console.error("[loadProject] Missing project name.");
        throw new Error("Project name is required.");
    }

    try {
        const url = `/api/project/load?projectName=${encodeURIComponent(projectName)}`;
        console.log(`[loadProject] Loading project "${projectName}"...`);
        const data = await fetchWithAuth(url, { method: "GET" });
        return data.content;
    } catch (error) {
        console.error("[loadProject] Error loading project:", error);
        throw error;
    }
};

// Create a project hierarchy
export const createProjectHierarchy = async (projectName) => {
    if (!projectName) {
        console.error("[createProjectHierarchy] Missing project name.");
        throw new Error("Project name is required.");
    }

    try {
        const url = `/api/project/createHierarchy`;
        const body = JSON.stringify({ projectName });
        console.log(`[createProjectHierarchy] Creating hierarchy for project "${projectName}"...`);
        return await fetchWithAuth(url, { method: "POST", body });
    } catch (error) {
        console.error("[createProjectHierarchy] Error creating project hierarchy:", error);
        throw error;
    }
};
