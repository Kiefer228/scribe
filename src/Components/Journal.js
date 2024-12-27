import React, { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import '../styles/journal.css'; // Updated styling for this module

const Journal = () => {
  const [modulePosition, setModulePosition] = useState({ x: 0, y: 0 }); // Default position

  useEffect(() => {
    // Calculate the center position based on the current window size (only on mount)
    const calculateCenterPosition = () => {
      const centerX = (window.innerWidth - 400) / 2; // Fixed width: 400
      const centerY = (window.innerHeight - 400) / 2; // Fixed height: 400
      setModulePosition({ x: centerX, y: centerY });
    };

    // Call calculateCenterPosition only once on mount (initial load)
    calculateCenterPosition();

    // Optional: Recalculate position on window resize if desired
    const handleResize = () => {
      calculateCenterPosition();
    };
    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty dependency array ensures this effect only runs once on mount

  return (
    <div className="journal-container">
      <Rnd
        className="journal-module"
        size={{ width: 400, height: 400 }} // Fixed size
        position={modulePosition} // Use position from state
        onDragStop={(e, d) => {
          setModulePosition({ x: d.x, y: d.y }); // Update position when dragging stops
        }}
        bounds="parent"
        enableResizing={false} // Disable resizing
        dragHandleClassName="journal-drag-handle" // Restrict dragging to the handle
      >
        <div className="journal-module-content" style={{ width: '100%', height: '100%' }}>
          <div className="journal-drag-handle" style={{ height: '20px', backgroundColor: 'lightgrey', cursor: 'move' }} />
          <div className="journal-module-body">
            <textarea
              className="note-textarea"
              placeholder="Type your notes here..."
            />
          </div>
        </div>
      </Rnd>
    </div>
  );
};

export default Journal;
