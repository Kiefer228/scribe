const API_BASE_URL = "https://scribe-backend-qe3m.onrender.com";

// Google Authentication APIs

/**
 * Redirects the user to the Google OAuth authentication page.
 */
export const initiateGoogleAuth = async () => {
    try {
        window.location.href = `${API_BASE_URL}/auth/google`;
    } catch (error) {
        console.error("Error initiating Google OAuth authentication:", error);
        throw error;
    }
};

/**
 * Checks the authentication status of the user by querying the backend.
 * @returns {Promise<Object>} - Authentication status as a JSON object.
 */
export const checkAuthStatus = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/status`);
        if (!response.ok) {
            throw new Error(`Failed to check authentication status: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error checking authentication status:", error);
        throw error;
    }
};

// Project Management APIs

/**
 * Saves a project to the backend.
 * @param {string} projectId - The ID of the project to save.
 * @param {string} content - The content to save in the project.
 * @returns {Promise<Object>} - Response from the backend.
 */
export const saveProject = async (projectId, content) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/project/save`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ projectId, content }),
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to save project: ${errorText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error saving project:", error);
        throw error;
    }
};

/**
 * Loads a project from the backend.
 * @param {string} projectId - The ID of the project to load.
 * @returns {Promise<string>} - The content of the loaded project.
 */
export const loadProject = async (projectId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/project/load/${projectId}`);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to load project: ${errorText}`);
        }
        const data = await response.json();
        return data.content; // Assuming the response includes `content` directly
    } catch (error) {
        console.error("Error loading project:", error);
        throw error;
    }
};
