import React, { useState } from "react";
import { Rnd } from "react-rnd";
import "../styles/ModuleContainer.css";

const ModuleContainer = ({
  children,
  moduleName,
  defaultPosition = { x: 0, y: 0, width: 200, height: 200 },
  isMovable = true,
  isResizable = true,
  className = "",
}) => {
  const [position, setPosition] = useState(defaultPosition);
  const [isLocked, setIsLocked] = useState(false);

  const toggleLock = () => setIsLocked((prev) => !prev);

  return (
    <Rnd
      className={`module ${isLocked ? "locked" : ""} ${className}`}
      size={{ width: position.width, height: position.height }}
      position={{ x: position.x, y: position.y }}
      onDragStop={(e, d) => {
        if (isMovable && !isLocked) {
          setPosition((prev) => ({ ...prev, x: d.x, y: d.y }));
        }
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        if (isResizable && !isLocked) {
          setPosition({
            x: position.x,
            y: position.y,
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
          aria-pressed={isLocked}
        >
          {isLocked ? "🔒" : "🔓"}
        </button>
        {React.cloneElement(children, { position, isLocked, toggleLock })}
      </div>
    </Rnd>
  );
};

export default ModuleContainer;
