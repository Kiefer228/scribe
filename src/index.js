import React from "react";
import ReactDOM from "react-dom/client"; // Use createRoot for React 18+
import "./index.css"; // Global styles
import App from "./App.js"; // Ensure the file path is correct
import { GoogleDriveProvider } from "./context/useGoogleDrive"; // Add GoogleDriveProvider

// Polyfills for Node.js modules
import { Buffer } from "buffer";
import process from "process";
import stream from "stream-browserify";

// Inject polyfills into the global scope
window.Buffer = Buffer;
window.process = process;
window.stream = stream;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <GoogleDriveProvider>
            <App />
        </GoogleDriveProvider>
    </React.StrictMode>
);
