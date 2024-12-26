import React from 'react';
import { useEditorState } from '../context/useEditorState'; // Use the context
import ReactQuill from 'react-quill'; // Rich text editor
import 'react-quill/dist/quill.snow.css'; // Include Quill's styles
import '../styles/editor.css';

const Editor = () => {
    const { content, updateContent } = useEditorState(); // Access editor state

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
		