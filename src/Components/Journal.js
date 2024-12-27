import React, { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import '../styles/journal.css'; // Styling specific to the journal module

const Journal = () => {
  const [modulePosition, setModulePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Function to calculate the centered position
    const calculateCenterPosition = () => {
      const width = 400; // Fixed width
      const height = 400; // Fixed height
      const centerX = (window.innerWidth - width) / 2;
      const centerY = (window.innerHeight - height) / 2;
      setModulePosition({ x: centerX, y: centerY });
    };

    // Set initial position
    calculateCenterPosition();

    // Optional: Adjust position on window resize
    const handleResize = () => {
      calculateCenterPosition();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="journal-container">
      <Rnd
        className="journal-module"
        size={{ width: 400, height: 400 }}
        position={modulePosition}
        onDragStop={(e, d) => setModulePosition({ x: d.x, y: d.y })}
        bounds="parent"
        enableResizing={false}
      >
        <div className="journal-module-content">
          {/* Note Taking Body */}
          <div className="journal-module-body">
            <textarea
              className="note-textarea"
              placeholder="Type your notes here..."
              }
            />
          </div>
        </div>
      </Rnd>
    </div>
  );
};

export default Journal;
