import React from 'react';
import '../styles/journal.css'; // Import the specific styles for the Journal module

const Journal = ({ content, updateContent }) => {
  return (
    <div className="journal-container">
      <textarea
        className="journal-textarea"
        value={content}
        onChange={(e) => updateContent(e.target.value)}
        placeholder="Write your journal entry here..."
      />
    </div>
  );
};

export default Journal;
