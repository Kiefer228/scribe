const API_BASE_URL = "https://scribe-backend-qe3m.onrender.com";

export const initiateGoogleAuth = async () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
};

export const checkAuthStatus = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/status`);
        if (!response.ok) {
            throw new Error("Failed to check authentication status.");
        }
        return await response.json();
    } catch (error) {
        console.error("Error checking authentication status:", error);
        throw error;
    }
};

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

export const loadProject = async (projectId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/project/load/${projectId}`);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to load project: ${errorText}`);
        }
        const data = await response.json();
        return data.content;
    } catch (error) {
        console.error("Error loading project:", error);
        throw error;
    }
};
