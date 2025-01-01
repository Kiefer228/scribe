import React, { useState } from "react";
import "../styles/journal.css";

const Journal = () => {
    const [notes, setNotes] = useState([]);
    const [inputValue, setInputValue] = useState("");

    const handleTabIndentation = (e) => {
        if (e.key === "Tab") {
            e.preventDefault();
            const textarea = e.target;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;

            // Insert a tab or 4 spaces for indentation
            const newValue =
                textarea.value.substring(0, start) +
                "\t" +
                textarea.value.substring(end);
            setInputValue(newValue);

            // Adjust the cursor position after adding indentation
            setTimeout(() => {
                textarea.selectionStart = textarea.selectionEnd = start + 1;
            }, 0);
        }
    };

    const handleAddNote = () => {
        if (inputValue.trim()) {
            setNotes((prevNotes) => [...prevNotes, inputValue.trim()]);
            setInputValue(""); // Clear input field
        }
    };

    return (
        <div className="journal-container">
            <div className="journal-notes">
                {notes.map((note, index) => (
                    <div key={index} className="journal-note">
                        {note}
                    </div>
                ))}
            </div>
            <textarea
                className="journal-textarea"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleTabIndentation}
                onKeyPress={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault(); // Prevent new lines in the text area
                        handleAddNote();
                    }
                }}
                placeholder="Type a quick note here."
            />
        </div>
    );
};

export default Journal;
