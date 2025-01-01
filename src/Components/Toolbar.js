import React, { useState, useEffect } from "react";
import "../styles/variables.css";
import "../styles/toolbar.css";
import { throttle } from "lodash";

const Toolbar = ({ setProjectName }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [projectNameInput, setProjectNameInput] = useState("");
    const [showInputModal, setShowInputModal] = useState(false);
    const [currentAction, setCurrentAction] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const handleMouseMove = throttle((e) => {
            setIsVisible(e.clientY < 100);
        }, 200);

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const toggleLogin = () => {
        setIsLoggedIn((prev) => !prev);
    };

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
        alert(`Simulating project ${action} for: ${projectNameInput}`);
    };

    return (
        <>
            {showInputModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <input
                            type="text"
                            placeholder="Enter project name"
                            value={projectNameInput}
                            onChange={(e) => setProjectNameInput(e.target.value)}
                        />
                        <div className="modal-actions">
                            <button onClick={handleModalSubmit}>Submit</button>
                            <button onClick={() => setShowInputModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
            <div className={`toolbar ${isVisible ? "visible" : "hidden"}`}>
                <div className="toolbar-left">
                    <button onClick={toggleLogin}>{isLoggedIn ? "Logout" : "Login"}</button>
                    <button onClick={() => getProjectName("create")}>New</button>
                    <button onClick={() => getProjectName("load")}>Load</button>
                    <button onClick={() => getProjectName("save")}>Save</button>
                </div>
                <div className="toolbar-right">
                    <button onClick={() => alert("Stuck button clicked")}>Stuck</button>
                    <button onClick={() => alert("Section Review button clicked")}>Section Review</button>
                    <button onClick={() => alert("Draft Review button clicked")}>Draft Review</button>
                    <span className="connection-status">○ Offline</span>
                </div>
            </div>
        </>
    );
};

export default Toolbar;
