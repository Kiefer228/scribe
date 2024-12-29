import React from "react";
import ReactDOM from "react-dom/client"; // Use createRoot for React 18+
import "./index.css"; // Global styles
import App from "./App.js"; // Ensure the file path is correct
import { GoogleDriveProvider } from "./context/useGoogleDrive"; // Add GoogleDriveProvider

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <GoogleDriveProvider> {/* Wrap App in GoogleDriveProvider */}
            <App />
        </GoogleDriveProvider>
    </React.StrictMode>
);
