import React from 'react';
import { useEditorState } from '../context/useEditorState';
import '../styles/editor.css';

const Editor = () => {
  const { content, updateContent } = useEditorState();

  return (
    <div className="editor-container">
      <textarea
        className="editor-textarea"
        value={content}
        onChange={(e) => updateContent(e.target.value)}
        placeholder="Start writing here..."
      />
    </div>
  );
};

export default Editor;