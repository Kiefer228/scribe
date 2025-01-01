import React, { useState } from "react";
import "../styles/journal.css";

const Journal = ({ content = "", updateContent }) => {
    const [notes, setNotes] = useState([]);
    const [inputValue, setInputValue] = useState("");

    const handleAddNote = () => {
        if (inputValue.trim() === "") return;
        setNotes((prevNotes) => [...prevNotes, inputValue.trim()]);
        setInputValue(""); // Clear the input field
    };

    return (
        <div className="journal-container">
            {/* Text input area for new notes */}
            <textarea
                className="journal-textarea"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault(); // Prevent new lines in the text area
                        handleAddNote();
                    }
                }}
                placeholder="Type a quick note here."
                aria-label="Journal note input"
                style={{ resize: "none" }}
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
