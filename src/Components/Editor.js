import React, { useRef, useEffect } from "react";
import { useEditorState } from "../context/useEditorState"; // Use the EditorState context
import "../styles/editor.css";

const Editor = () => {
    const { content, setContent } = useEditorState(); // Access context for content and setContent
    const textareaRef = useRef(null);

    // Dynamically adjust the textarea height based on content
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";  // Reset height before calculating
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;  // Adjust height based on content
        }
    }, [content]); // Re-run when content changes

    const handleTabIndentation = (e) => {
        if (e.key === "Tab") {
            e.preventDefault();
            const textarea = e.target;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const value = textarea.value;

            // Add a tab character for indentation or 4 spaces
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
                ref={textareaRef} // Attach ref to the textarea for dynamic resizing
                className="editor-textarea"
                value={content}
                onChange={handleChange}
                onKeyDown={handleTabIndentation} // Handle tab key for indentation
                placeholder="Start writing here..."
                rows="10"
                style={{ resize: "none", width: "100%" }} // Disable manual resizing (optional)
            />
        </div>
    );
};

export default Editor;
