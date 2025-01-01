import React, { useState } from "react";
import { Rnd } from "react-rnd";
import "../styles/ModuleContainer.css";

const ModuleContainer = ({
  children,
  moduleName,
  size,
  position,
  isMovable = true,
  isResizable = true,
  className = "",
  onDragStop = () => {},
  onResizeStop = () => {},
}) => {
  const [isLocked, setIsLocked] = useState(false);

  const toggleLock = () => setIsLocked((prev) => !prev);

  return (
    <Rnd
      className={`module ${isLocked ? "locked" : ""} ${className}`}
      size={size}
      position={position}
      onDragStop={(e, d) => {
        if (isMovable && !isLocked) {
          onDragStop(moduleName, { x: d.x, y: d.y });
        }
      }}
      onResizeStop={(e, direction, ref, delta, newPos) => {
        if (isResizable && !isLocked) {
          onResizeStop(moduleName, {
            x: newPos.x,
            y: newPos.y,
            width: ref.offsetWidth,
            height: ref.offsetHeight,
          });
        }
      }}
      bounds="parent"
      enableResizing={isResizable && !isLocked}
      disableDragging={!isMovable || isLocked}
    >
      <div className="module-content">
        <button
          className="lock-button"
          onClick={toggleLock}
          aria-label="Toggle Lock"
        >
          {isLocked ? "🔒" : "🔓"}
        </button>
        {children}
      </div>
    </Rnd>
  );
};

export default ModuleContainer;
