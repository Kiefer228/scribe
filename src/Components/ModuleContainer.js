import React from "react";
import { Rnd } from "react-rnd";
import "../styles/ModuleContainer.css"; // Optional: Specific styles for module container

const ModuleContainer = ({
  children,
  width,
  height,
  x,
  y,
  isMovable = true,
  isResizable = true,
  onDragStop = () => {},
  onResizeStop = () => {},
  className = "",
  isLocked = false,
  toggleLock = () => {},
}) => (
  <Rnd
    className={`module ${isLocked ? "locked" : ""} ${className}`}
    size={{ width, height }}
    position={{ x, y }}
    onDragStop={isMovable && !isLocked ? onDragStop : undefined}
    onResizeStop={isResizable && !isLocked ? onResizeStop : undefined}
    bounds="parent"
    enableResizing={isResizable && !isLocked}
    disableDragging={!isMovable || isLocked}
  >
    <div className="module-content">
      <button
        className="lock-button"
        onClick={toggleLock}
        aria-label="Toggle Lock"
        aria-pressed={isLocked}
      >
        {isLocked ? "🔒" : "🔓"}
      </button>
      {children}
    </div>
  </Rnd>
);

export default ModuleContainer;
