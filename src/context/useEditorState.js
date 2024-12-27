import React, { createContext, useContext, useState } from 'react';

const EditorStateContext = createContext();

export const useEditorState = () => {
    const context = useContext(EditorStateContext);
    if (!context) {
        throw new Error('useEditorState must be used within an EditorStateProvider');
    }
    return context;
};

export const EditorStateProvider = ({ children }) => {
    const [content, setContent] = useState("");

    const updateContent = (newContent) => {
        setContent(newContent);
    };

    return (
        <EditorStateContext.Provider value={{ content, updateContent }}>
            {children}
        </EditorStateContext.Provider>
    );
};