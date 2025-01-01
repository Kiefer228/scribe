import React, { useEffect } from "react";
import { useEditorState } from "../context/useEditorState";
import "../styles/editor.css";

const Editor = ({ registerModule }) => {
    const { content, setContent } = useEditorState();

    useEffect(() => {
        // Register default position for the Editor module
        registerModule("editor", { x: 650, y: 75 });
    }, [registerModule]);

    const handleTabIndentation = (e) => {
        if (e.key === "Tab") {
            e.preventDefault();
            const textarea = e.target;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;

            const newValue =
                textarea.value.substring(0, start) +
                "\t" +
                textarea.value.substring(end);
            setContent(newValue);

            setTimeout(() => {
                textarea.selectionStart = textarea.selectionEnd = start + 1;
            }, 0);
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
                onKeyDown={handleTabIndentation}
                placeholder="Start writing here..."
            />
        </div>
    );
};

export default Editor;
