const API_BASE_URL = "https://scribe-backend-qe3m.onrender.com";

// Helper: Fetch with authentication
const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem("isAuthenticated");
    if (!token) {
        throw new Error("User not authenticated");
    }

    const headers = {
        ...options.headers,
        "Content-Type": "application/json",
    };

    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }

    return response.json();
};

// Redirect to Google Authentication
export const initiateGoogleAuth = async () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
};

// Check authentication status
export const checkAuthStatus = async () => {
    try {
        return await fetchWithAuth("/auth/status");
    } catch (error) {
        console.error("Error checking authentication status:", error);
        throw error;
    }
};

// Save a project to the backend
export const saveProject = async (projectName, content) => {
    try {
        return await fetchWithAuth("/api/project/save", {
            method: "POST",
            body: JSON.stringify({ projectName, content }),
        });
    } catch (error) {
        console.error("Error saving project:", error);
        throw error;
    }
};

// Load a project from the backend
export const loadProject = async (projectName) => {
    try {
        const data = await fetchWithAuth("/api/project/load", {
            method: "POST",
            body: JSON.stringify({ projectName }),
        });
        return data.content;
    } catch (error) {
        console.error("Error loading project:", error);
        throw error;
    }
};
