import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useEditorState } from '../context/useEditorState';

const Editor = () => {
    const { content, updateContent } = useEditorState();

    return (
        <div className="editor-container">
            <ReactQuill
                value={content}
                onChange={updateContent}
                theme="snow"
                placeholder="Start writing your content here..."
            />
        </div>
    );
};

export default Editor;
