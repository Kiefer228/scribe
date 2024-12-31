import React from "react";
import ReactDOM from "react-dom/client"; // Use createRoot for React 18+
import "./index.css"; // Global styles
import App from "./App.js"; // Ensure the file path is correct
import { GoogleDriveProvider } from "./context/useGoogleDrive"; // Add GoogleDriveProvider

// Polyfills for Node.js modules
import { Buffer } from "buffer";
import process from "process";
import stream from "stream-browserify";
import util from "util";
import path from "path-browserify";
import assert from "assert";
import os from "os-browserify";
import https from "https-browserify";
import http from "stream-http";
import url from "url";
import zlib from "browserify-zlib";

// Inject polyfills into the global scope
window.Buffer = Buffer;
window.process = process;
window.stream = stream;
window.util = util;
window.path = path;
window.assert = assert;
window.os = os;
window.https = https;
window.http = http;
window.url = url;
window.zlib = zlib;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <GoogleDriveProvider>
            <App />
        </GoogleDriveProvider>
    </React.StrictMode>
);
