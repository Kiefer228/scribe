const API_BASE_URL = "https://scribe-backend-qe3m.onrender.com";

// Helper: Fetch with authentication
const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
        console.error("[fetchWithAuth] No authentication token found.");
        throw new Error("User not authenticated");
    }

    const headers = {
        ...options.headers,
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };

    console.log(`[fetchWithAuth] Requesting: ${API_BASE_URL}${url}`, options);

    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
        try {
            const response = await fetch(`${API_BASE_URL}${url}`, {
                ...options,
                headers,
            });

            if (!response.ok) {
                const errorMessage = `HTTP error: ${response.status}`;
                console.error(`[fetchWithAuth] ${errorMessage}`);
                if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem("authToken");
                    console.warn("[fetchWithAuth] Invalid or expired token. Redirecting to home...");
                    window.location.href = "https://scribeaiassistant.netlify.app"; // Redirect user to homepage
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            console.log(`[fetchWithAuth] Success:`, data);
            return data;
        } catch (error) {
            attempt++;
            if (attempt >= maxRetries) {
                console.error(`[fetchWithAuth] Network or server error after ${maxRetries} attempts:`, error.message);
                throw error;
            }
            console.warn(`[fetchWithAuth] Retrying request (attempt ${attempt})...`);
        }
    }
};

// Redirect to Google Authentication
export const initiateGoogleAuth = () => {
    console.log("[initiateGoogleAuth] Redirecting to Google OAuth...");
    const stateParam = encodeURIComponent(Math.random().toString(36).substring(2)); // Random state parameter
    window.location.href = `${API_BASE_URL}/auth/google?state=${stateParam}`;
};

// Check authentication status
export const checkAuthStatus = async () => {
    try {
        console.log("[checkAuthStatus] Checking authentication status...");
        const response = await fetchWithAuth("/auth/status", { method: "GET" });
        return response;
    } catch (error) {
        console.error("[checkAuthStatus] Error:", error.message);
        return { authenticated: false, error: error.message };
    }
};

// Validate projectName and content
const validateSaveInputs = (projectName, content) => {
    if (!projectName || !content) {
        throw new Error("Project name and content are required to save a project.");
    }

    const sanitizedProjectName = projectName.replace(/[^a-zA-Z0-9-_.\s]/g, "").trim();

    if (!sanitizedProjectName) {
        throw new Error("Invalid project name after sanitization.");
    }

    return sanitizedProjectName;
};

// Save a project to the backend
export const saveProject = async (projectName, content) => {
    const sanitizedProjectName = validateSaveInputs(projectName, content);

    const url = `/api/project/save`;
    const body = JSON.stringify({ projectName: sanitizedProjectName, content });

    console.log(`[saveProject] Saving project: ${sanitizedProjectName}`);
    try {
        const response = await fetchWithAuth(url, {
            method: "POST",
            body,
        });
        console.log(`[saveProject] Project saved successfully:`, response);
        return response;
    } catch (error) {
        console.error(`[saveProject] Error saving project "${sanitizedProjectName}":`, error.message);
        throw error;
    }
};

// Load a project from the backend
export const loadProject = async (projectName) => {
    if (!projectName) {
        throw new Error("Project name is required to load a project.");
    }

    const sanitizedProjectName = projectName.replace(/[^a-zA-Z0-9-_.\s]/g, "").trim();

    if (!sanitizedProjectName) {
        throw new Error("Invalid project name after sanitization.");
    }

    const url = `/api/project/load?projectName=${encodeURIComponent(sanitizedProjectName)}`;

    console.log(`[loadProject] Loading project: ${sanitizedProjectName}`);
    try {
        const response = await fetchWithAuth(url, { method: "GET" });
        console.log(`[loadProject] Project loaded successfully:`, response);
        return response;
    } catch (error) {
        console.error(`[loadProject] Error loading project "${sanitizedProjectName}":`, error.message);
        throw error;
    }
};

// Create a new project hierarchy
export const createProjectHierarchy = async (projectName) => {
    if (!projectName) {
        throw new Error("Project name is required to create a project hierarchy.");
    }

    const sanitizedProjectName = projectName.replace(/[^a-zA-Z0-9-_.\s]/g, "").trim();

    if (!sanitizedProjectName) {
        throw new Error("Invalid project name after sanitization.");
    }

    const url = `/api/project/createHierarchy`;
    const body = JSON.stringify({ projectName: sanitizedProjectName });

    console.log(`[createProjectHierarchy] Creating project hierarchy: ${sanitizedProjectName}`);
    try {
        const response = await fetchWithAuth(url, {
            method: "POST",
            body,
        });
        console.log(`[createProjectHierarchy] Project hierarchy created successfully:`, response);
        return response;
    } catch (error) {
        console.error(`[createProjectHierarchy] Error creating project hierarchy "${sanitizedProjectName}":`, error.message);
        throw error;
    }
};
