import React, { useCallback } from 'react';
import '../styles/journal.css'; // Import the specific styles for the Journal module
import { debounce } from 'lodash';

const Journal = ({ content = "", updateContent }) => {
  const debouncedUpdateContent = useCallback(
    debounce((value) => updateContent(value), 300),
    [updateContent]
  );

  return (
    <div className="journal-container">
      <textarea
        className="journal-textarea"
        value={content}
        onChange={(e) => debouncedUpdateContent(e.target.value)}
        placeholder="Type your journal entry here to capture your thoughts and ideas..."
        aria-label="Journal entry text area, type your thoughts here"
        role="textbox"
        aria-multiline="true"
      />
    </div>
  );
};

export default Journal;
