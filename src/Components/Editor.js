import React from "react";
import { useEditorState } from "../context/useEditorState"; // Use the EditorState context
import "../styles/editor.css";

const Editor = () => {
    const { content, setContent } = useEditorState();

    const handleTabIndentation = (e) => {
        if (e.key === "Tab") {
            e.preventDefault();
            const textarea = e.target;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const value = textarea.value;

            // Insert a tab character for indentation or 4 spaces
            setContent(value.substring(0, start) + "\t" + value.substring(end));

            // Adjust the cursor position after adding indentation
            textarea.selectionStart = textarea.selectionEnd = start + 1;
        }
    };

    const handleChange = (e) => {
        setContent(e.target.value); // Update the content globally
    };

    return (
        <div className="editor-container">
            <textarea
                className="editor-textarea"
                value={content}
                onChange={handleChange}
                onKeyDown={handleTabIndentation} // Handle tab key for indentation
                placeholder="Start writing here..."
            />
        </div>
    );
};

export default Editor;
