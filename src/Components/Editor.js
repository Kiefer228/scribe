import React from 'react';
import { useEditorState } from '../context/useEditorState';
import { Rnd } from 'react-rnd';
import '../styles/editor.css';

const Editor = () => {
  const { content, updateContent } = useEditorState();

  return (
    <Rnd
      className="editor-module"
      size={{ width: 600, height: 800 }} // Default size for Editor module
      position={{ x: 0, y: 0 }} // Center position will be handled dynamically in App.js
      onDragStop={(e, d) => {
        // Handle drag position
      }}
      bounds="parent"
      enableResizing={{
        top: false,
        right: true,
        bottom: true,
        left: true,
      }}
    >
      <div className="editor-container">
        <textarea
          className="editor-textarea"
          value={content}
          onChange={(e) => updateContent(e.target.value)}
          placeholder="Start writing here..."
        />
      </div>
    </Rnd>
  );
};

export default Editor;
