import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useEditorState } from '../context/useEditorState';

function Editor() {
    const { content, updateContent } = useEditorState();
    const handleChange = (value) => {
        updateContent(value);
    };

    return (
        <div className="editor-container">
            <ReactQuill value={content} onChange={handleChange} />
        </div>
    );
}

export default Editor;
