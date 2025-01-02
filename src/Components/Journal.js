import React, { useState } from "react";
import "../styles/journal.css"; // Import the CSS file for styling

const Journal = () => {
  const [notes, setNotes] = useState([]); // State to store notes
  const [inputValue, setInputValue] = useState("");

  const handleAddNote = () => {
    if (inputValue.trim()) {
      setNotes((prevNotes) => [...prevNotes, inputValue.trim()]); // Add new note to state
      setInputValue(""); // Clear the input field
    }
  };

  return (
    <div className="journal-container">
      <textarea
        className="journal-textarea"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleAddNote();
          }
        }}
        placeholder="Type a quick note here."
      />
      <div className="notes-container">
        {notes.map((note, index) => (
          <div key={index} className="note">
            {note}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Journal;
