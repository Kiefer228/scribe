const API_BASE_URL = "https://scribe-backend-qe3m.onrender.com";

// Helper: Fetch with authentication
const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem("authToken"); // Use a clear and consistent key for the token
    if (!token) {
        console.error("[fetchWithAuth] No authentication token found.");
        throw new Error("User not authenticated");
    }

    const headers = {
        ...options.headers,
        "Content-Type": "application/json", // Ensure content type for JSON requests
        Authorization: `Bearer ${token}`, // Add the Authorization header
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
            // Handle 401 (Unauthorized) or 403 (Forbidden) errors explicitly
            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem("authToken"); // Clear invalid token
                console.warn("[fetchWithAuth] Invalid or expired token. Please reauthenticate.");
            }
            throw new Error(errorMessage);
        }

        const data = await response.json();
        console.log(`[fetchWithAuth] Success:`, data);
        return data;
    } catch (error) {
        console.error("[fetchWithAuth] Network or server error:", error.message);
        throw error; // Propagate the error for higher-level handling
    }
};

// Redirect to Google Authentication
export const initiateGoogleAuth = () => {
    console.log("[initiateGoogleAuth] Redirecting to Google OAuth...");
    window.location.href = `${API_BASE_URL}/auth/google`;
};

// Check authentication status
export const checkAuthStatus = async () => {
    try {
        console.log("[checkAuthStatus] Checking authentication status...");
        const response = await fetchWithAuth("/auth/status", { method: "GET" });
        return response;
    } catch (error) {
        console.error("[checkAuthStatus] Error:", error.message);
        // Explicitly return a consistent error structure
        return { authenticated: false, error: error.message };
    }
};

// Save a project to the backend
export const saveProject = async (projectName, content) => {
    if (!projectName || !content) {
        throw new Error("Project name and content are required to save a project.");
    }

    const url = `/api/project/save`;
    const body = JSON.stringify({ projectName, content });

    console.log(`[saveProject] Saving project: ${projectName}`);
    try {
        const response = await fetchWithAuth(url, {
            method: "POST",
            body,
        });
        console.log(`[saveProject] Project saved successfully:`, response);
        return response;
    } catch (error) {
        console.error(`[saveProject] Error saving project "${projectName}":`, error.message);
        throw error;
    }
};

// Load a project from the backend
export const loadProject = async (projectName) => {
    if (!projectName) {
        throw new Error("Project name is required to load a project.");
    }

    const url = `/api/project/load?projectName=${encodeURIComponent(projectName)}`;

    console.log(`[loadProject] Loading project: ${projectName}`);
    try {
        const response = await fetchWithAuth(url, { method: "GET" });
        console.log(`[loadProject] Project loaded successfully:`, response);
        return response;
    } catch (error) {
        console.error(`[loadProject] Error loading project "${projectName}":`, error.message);
        throw error;
    }
};

// Create a new project hierarchy
export const createProjectHierarchy = async (projectName) => {
    if (!projectName) {
        throw new Error("Project name is required to create a project hierarchy.");
    }

    const url = `/api/project/createHierarchy`;
    const body = JSON.stringify({ projectName });

    console.log(`[createProjectHierarchy] Creating project hierarchy: ${projectName}`);
    try {
        const response = await fetchWithAuth(url, {
            method: "POST",
            body,
        });
        console.log(`[createProjectHierarchy] Project hierarchy created successfully:`, response);
        return response;
    } catch (error) {
        console.error(`[createProjectHierarchy] Error creating project hierarchy "${projectName}":`, error.message);
        throw error;
    }
};
