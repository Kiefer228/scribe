import React, { useState } from "react";

const Journal = () => {
    const [inputValue, setInputValue] = useState("");

    const handleInput = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (inputValue.trim()) {
                setInputValue(""); // Clear the input after adding a note
            }
        }
    };

    return (
        <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleInput}
            placeholder="Type a quick note here."
        />
    );
};

export default Journal;
