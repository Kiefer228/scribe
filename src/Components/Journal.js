import React, { useState, useRef, useEffect } from "react";
import "../styles/journal.css";

const Journal = ({ content = "", updateContent }) => {
    const [notes, setNotes] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const textareaRef = useRef(null);

    // Dynamically adjust the height of the textarea based on content
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";  // Reset height before calculating
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;  // Set height based on content
        }
    }, [inputValue]); // Re-run when inputValue changes

    const handleTabIndentation = (e) => {
        if (e.key === "Tab") {
            e.preventDefault();
            const textarea = e.target;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const value = textarea.value;

            // Add a tab or 4 spaces for indentation
            setInputValue(value.substring(0, start) + "\t" + value.substring(end));

            // Adjust the cursor position after adding indentation
            textarea.selectionStart = textarea.selectionEnd = start + 1;
        }
    };

    const handleAddNote = () => {
        if (inputValue.trim() === "") return;
        setNotes((prevNotes) => [...prevNotes, inputValue.trim()]);
        setInputValue(""); // Clear the input field
    };

    const handleChange = (e) => {
        setInputValue(e.target.value); // Update the content for the textarea
    };

    return (
        <div className="journal-container">
            {/* Text input area for new notes */}
            <textarea
                ref={textareaRef} // Attach ref for dynamic resizing
                className="journal-textarea"
                value={inputValue}
                onChange={handleChange}
                onKeyDown={handleTabIndentation} // Handle tab for indentation
                onKeyPress={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault(); // Prevent new lines in the text area
                        handleAddNote();
                    }
                }}
                placeholder="Type a quick note here."
                aria-label="Journal note input"
                style={{ resize: "none" }} // Disable manual resizing
            />

            {/* Scrollable list of notes */}
            <div className="journal-notes">
                {notes.map((note, index) => (
                    <div key={index} className="journal-note">
                        {note}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Journal;
