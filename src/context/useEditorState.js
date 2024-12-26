import { useState, createContext, useContext } from 'react';

const EditorStateContext = createContext();

export const useEditorState = () => {
    const context = useContext(EditorStateContext);

    // Guard against using the hook outside of its provider
    if (!context) {
        throw new Error("useEditorState must be used within an EditorStateProvider");
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
