import React, { useState, useEffect } from "react";
import "../styles/journal.css";

const Journal = ({ registerModule, content, setContent }) => {
    const [notes, setNotes] = useState([]);
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        // Register default position for the Journal module
        registerModule("journal", { x: 200, y: 75 });
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
            setInputValue(newValue);

            setTimeout(() => {
                textarea.selectionStart = textarea.selectionEnd = start + 1;
            }, 0);
        }
    };

    const handleAddNote = () => {
        if (inputValue.trim()) {
            setNotes((prevNotes) => [...prevNotes, inputValue.trim()]);
            setInputValue("");
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
                        e.preventDefault();
                        handleAddNote();
                    }
                }}
                placeholder="Type a quick note here."
            />
        </div>
    );
};

export default Journal;
