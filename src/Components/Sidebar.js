import React, { useState } from 'react';
import '../styles/sidebar.css';

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <button className="sidebar-toggle" onClick={toggleSidebar}>
                {isCollapsed ? '>' : '<'} {/* Change icon based on state */}
            </button>
            {!isCollapsed && (
                <>
                    <h2>Sidebar</h2>
                    <p>Some sidebar content goes here.</p>
                    <a href="#link1">Link 1</a>
                    <a href="#link2">Link 2</a>
                </>
            )}
        </div>
    );
};

export default Sidebar;
