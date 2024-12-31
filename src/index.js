import React from "react";
import ReactDOM from "react-dom/client"; // React 18+ syntax
import "./index.css"; // Global styles
import App from "./App.js"; // Main App component
import { GoogleDriveProvider } from "./context/useGoogleDrive"; // Context provider

// Polyfills for Node.js modules
import { Buffer } from "buffer";
import process from "process/browser";
import path from "path-browserify";
import util from "util";
import os from "os-browserify";
import https from "https-browserify";
import url from "url";
import zlib from "browserify-zlib";

// Inject polyfills into the global scope
if (typeof window !== "undefined") {
  window.Buffer = Buffer;
  window.process = process;
  window.path = path;
  window.util = util;
  window.os = os;
  window.https = https;
  window.url = url;
  window.zlib = zlib;
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <GoogleDriveProvider>
      <App />
    </GoogleDriveProvider>
  </React.StrictMode>
);
