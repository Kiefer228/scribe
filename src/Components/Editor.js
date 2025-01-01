import React from "react";
import { useEditorState } from "../context/useEditorState"; // Use the EditorState context
import "../styles/editor.css";

const Editor = () => {
    const { content, setContent } = useEditorState(); // Access context for content and setContent

    return (
        <div className="editor-container">
            <textarea
                className="editor-textarea"
                value={content} // Use content directly, assuming it's managed in context
                onChange={(e) => setContent(e.target.value)} // Update content via setContent
                placeholder="Start writing here..."
            />
        </div>
    );
};

export default Editor;
