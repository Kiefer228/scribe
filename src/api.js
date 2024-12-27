const API_BASE_URL = "http://localhost:4000";

// Google Authentication APIs
export const initiateGoogleAuth = async () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
};

export const checkAuthStatus = async () => {
    const response = await fetch(`${API_BASE_URL}/auth/status`);
    return await response.json();
};

// Project Management APIs
export const saveProject = async (projectData) => {
    const response = await fetch(`${API_BASE_URL}/projects/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectData }),
    });
    return await response.json();
};

export const loadProject = async (projectId) => {
    const response = await fetch(`${API_BASE_URL}/projects/load/${projectId}`);
    return await response.json();
};
