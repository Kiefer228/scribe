import React, { useState } from "react";
import "../styles/Journal.css"; // Import the CSS file for styling

const Journal = () => {
  const notes = []; // Local array to store notes
  const [inputValue, setInputValue] = useState("");

  const handleAddNote = () => {
    if (inputValue.trim()) {
      notes.push(inputValue.trim()); // Save note to the local array
      console.log("Note added:", inputValue.trim()); // Optional: Log for debugging
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
    </div>
  );
};

export default Journal;
