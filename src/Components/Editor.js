import React from "react";
import { useEditorState } from "../context/useEditorState"; // Use the EditorState context
import "../styles/editor.css";

const Editor = () => {
    const { content, updateContent } = useEditorState();

    return (
        <div className="editor-container">
            <textarea
                className="editor-textarea"
                value={content}
                onChange={(e) => updateContent(e.target.value)} // Update content via context
                placeholder="Start writing here..."
            />
        </div>
    );
};

export default Editor;
