import React, { useState, useEffect } from 'react';
import './styles/App.css';
import './styles/variables.css';
import Editor from './Components/Editor';
import Journal from './Components/Journal';
import Toolbar from './Components/Toolbar';
import ModuleContainer from './Components/ModuleContainer';
import { EditorStateProvider } from './context/useEditorState';
import { GoogleDriveProvider } from './context/useGoogleDrive';

function App() {
    const [editorState, setEditorState] = useState({
        width: 600,
        height: 800,
        x: 0,
        y: 0,
        isLocked: false,
    });

    const [journalState, setJournalState] = useState({
        width: 400,
        height: 400,
        x: 0,
        y: 0,
        isLocked: false,
    });

    useEffect(() => {
        const updatePositions = () => {
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            setEditorState((prevState) => ({
                ...prevState,
                x: (viewportWidth - prevState.width) / 2,
                y: (viewportHeight - prevState.height) / 2,
            }));

            setJournalState((prevState) => ({
                ...prevState,
                x: viewportWidth / 4 - prevState.width / 2,
                y: (viewportHeight - prevState.height) / 2,
            }));
        };

        updatePositions();
        window.addEventListener('resize', updatePositions);
        return () => window.removeEventListener('resize', updatePositions);
    }, []);

    return (
        <GoogleDriveProvider>
            <EditorStateProvider>
                <div className="App">
                    <Toolbar />
                    <div className="desktop-layout">
                        <ModuleContainer
                            {...editorState}
                            isMovable={true}
                            isResizable={true}
                            onDragStop={(e, d) =>
                                setEditorState((prev) => ({
                                    ...prev,
                                    x: d.x,
                                    y: d.y,
                                }))
                            }
                            onResizeStop={(e, dir, ref, delta, pos) =>
                                setEditorState({
                                    width: parseInt(ref.style.width, 10),
                                    height: parseInt(ref.style.height, 10),
                                    x: pos.x,
                                    y: pos.y,
                                })
                            }
                        >
                            <Editor />
                        </ModuleContainer>
                        <ModuleContainer
                            {...journalState}
                            isMovable={true}
                            isResizable={false}
                            onDragStop={(e, d) =>
                                setJournalState((prev) => ({
                                    ...prev,
                                    x: d.x,
                                    y: d.y,
                                }))
                            }
                        >
                            <Journal />
                        </ModuleContainer>
                    </div>
                </div>
            </EditorStateProvider>
        </GoogleDriveProvider>
    );
}

export default App;
