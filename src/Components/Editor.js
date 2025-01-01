import React from "react";
import { useEditorState } from "../context/useEditorState"; // Use the EditorState context
import "../styles/editor.css";

const Editor = () => {
    const { content, setContent } = useEditorState(); // Access context for content and setContent

    const handleTabIndentation = (e) => {
        if (e.key === "Tab") {
            e.preventDefault();
            const textarea = e.target;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const value = textarea.value;

            // Add a tab or 4 spaces for indentation
            setContent(value.substring(0, start) + "\t" + value.substring(end));

            // Adjust the cursor position after adding indentation
            textarea.selectionStart = textarea.selectionEnd = start + 1;
        }
    };

    const handleChange = (e) => {
        setContent(e.target.value);
    };

    return (
        <div className="editor-container">
            <textarea
                className="editor-textarea"
                value={content}
                onChange={handleChange}
                onKeyDown={handleTabIndentation} // Handle tab for indentation
                placeholder="Start writing here..."
                rows="10"
                cols="50"
            />
        </div>
    );
};

export default Editor;
