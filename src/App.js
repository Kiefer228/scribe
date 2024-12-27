import React, { useState, useEffect } from 'react';
import './styles/App.css';
import Editor from './Components/Editor';
import Toolbar from './Components/Toolbar';
import { Rnd } from 'react-rnd';
import { EditorStateProvider } from './context/useEditorState';
import { GoogleDriveProvider } from './context/useGoogleDrive';
import { initiateGoogleAuth, checkAuthStatus, saveProject, loadProject } from './api';

function App() {
  const [moduleSize, setModuleSize] = useState({ width: 600, height: 800 }); // Default size
  const [modulePosition, setModulePosition] = useState({ x: 0, y: 0 }); // Default position
  const [isAuthenticated, setIsAuthenticated] = useState(false); // User authentication state
  const [projectData, setProjectData] = useState(null); // Loaded project data

  // Check authentication status on component mount
  useEffect(() => {
    const fetchAuthStatus = async () => {
      const status = await checkAuthStatus();
      setIsAuthenticated(status.authenticated);
    };
    fetchAuthStatus();
  }, []);

  // Handler to save the project
  const handleSaveProject = async () => {
    const sampleProjectData = { content: 'Sample project content' }; // Replace with actual editor content
    const response = await saveProject(sampleProjectData);
    alert(response.message);
  };

  // Handler to load a project by ID (hardcoded ID for now)
  const handleLoadProject = async () => {
    const projectId = 'sample-project-id'; // Replace with dynamic project ID
    const response = await loadProject(projectId);
    setProjectData(response.project);
    alert('Project loaded successfully!');
  };

  return (
    <GoogleDriveProvider>
      <EditorStateProvider>
        <div className="App">
          <header className="App-header">
            <h1>Scribe Application</h1>
            {!isAuthenticated ? (
              <button onClick={initiateGoogleAuth}>Login with Google</button>
            ) : (
              <p>Welcome! You are logged in.</p>
            )}
          </header>
          <main>
            <button onClick={handleSaveProject}>Save Project</button>
            <button onClick={handleLoadProject}>Load Project</button>
            {projectData && <pre>{JSON.stringify(projectData, null, 2)}</pre>}
            <Rnd
              size={moduleSize}
              position={modulePosition}
              onDragStop={(e, d) => setModulePosition({ x: d.x, y: d.y })}
              onResizeStop={(e, direction, ref, delta, position) =>
                setModuleSize({
                  width: ref.style.width.replace('px', ''),
                  height: ref.style.height.replace('px', ''),
                })
              }
            >
              <Editor />
            </Rnd>
            <Toolbar />
          </main>
        </div>
      </EditorStateProvider>
    </GoogleDriveProvider>
  );
}

export default App;
