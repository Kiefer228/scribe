import { useState, createContext, useContext } from 'react';

const EditorStateContext = createContext();

export const useEditorState = () => {
    return useContext(EditorStateContext);
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
