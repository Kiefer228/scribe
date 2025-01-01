import React, { useState, useEffect } from "react";
import "../styles/variables.css";
import "../styles/toolbar.css";
import { throttle } from "lodash";

const Toolbar = ({ setProjectName }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [projectNameInput, setProjectNameInput] = useState("");
    const [showInputModal, setShowInputModal] = useState(false);
    const [currentAction, setCurrentAction] = useState("");

    useEffect(() => {
        const handleMouseMove = throttle((e) => {
            // Show toolbar when mouse is near the top, hide when it moves away
            setIsVisible(e.clientY < 100);
        }, 200);

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const getProjectName = (action) => {
        setCurrentAction(action);
        setShowInputModal(true);
    };

    const handleModalSubmit = () => {
        if (!projectNameInput.trim()) {
            alert("Project name is required.");
            return;
        }
        setProjectName(projectNameInput);
        setShowInputModal(false);
        executeAction(currentAction);
    };

    const executeAction = (action) => {
        switch (action) {
            case "create":
                alert(`Simulating project creation for: ${projectNameInput}`);
                break;
            case "load":
                alert(`Simulating project load for: ${projectNameInput}`);
                break;
            case "save":
                alert(`Simulating project save for: ${projectNameInput}`);
                break;
            default:
                break;
        }
    };

    return (
        <>
            {showInputModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Enter Project Name</h3>
                        <input
                            type="text"
                            value={projectNameInput}
                            onChange={(e) => setProjectNameInput(e.target.value)}
                        />
                        <button onClick={handleModalSubmit}>Submit</button>
                        <button onClick={() => setShowInputModal(false)}>Cancel</button>
                    </div>
                </div>
            )}
            <div className={`toolbar ${isVisible ? "visible" : "hidden"}`}>
                <div className="toolbar-left">
                    <button onClick={() => getProjectName("create")}>New</button>
                    <button onClick={() => getProjectName("load")}>Load</button>
                    <button onClick={() => getProjectName("save")}>Save</button>
                </div>
                <div className="toolbar-right">
                    <span className="connection-status">○ Offline</span>
                </div>
            </div>
        </>
    );
};

export default Toolbar;
