import React, { useState, useEffect, useRef } from "react";
import "../styles/journal.css"; // Import the CSS file for styling

const Journal = () => {
  const [notes, setNotes] = useState([]); // State to store notes
  const [inputValue, setInputValue] = useState("");
  const notesEndRef = useRef(null);

  const handleAddNote = () => {
    if (inputValue.trim()) {
      setNotes((prevNotes) => [...prevNotes, inputValue.trim()]); // Add new note to state
      setInputValue(""); // Clear the input field
    }
  };

  useEffect(() => {
    notesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [notes]);

  return (
    <div className="journal-container">
      <div className="notes-container" style={{ overflowY: "auto", maxHeight: "300px" }}>
        {notes.map((note, index) => (
          <div key={index} className="note">
            {note}
          </div>
        ))}
        <div ref={notesEndRef} />
      </div>
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
    </div>
  );
};

export default Journal;
