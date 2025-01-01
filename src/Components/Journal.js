import React, { useState } from "react";

const Journal = () => {
    const [notes, setNotes] = useState([]);
    const [inputValue, setInputValue] = useState("");

    const addNote = () => {
        if (inputValue.trim()) {
            setNotes([...notes, inputValue.trim()]);
            setInputValue("");
        }
    };

    return (
        <textarea
            className="journal-textarea"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    addNote();
                }
            }}
            placeholder="Type a quick note here."
        />
    );
};

export default Journal;
