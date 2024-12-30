import React, { createContext, useContext, useReducer } from "react";

const EditorStateContext = createContext();

const initialState = {
    content: "", // Default content for the editor
    saved: true, // Tracks if content is saved
};

const reducer = (state, action) => {
    switch (action.type) {
        case "SET_CONTENT":
            return { ...state, content: action.payload, saved: false };
        case "MARK_SAVED":
            return { ...state, saved: true };
        case "RESET":
            return initialState;
        default:
            console.warn(`[useEditorState] Unknown action type: ${action.type}`);
            return state;
    }
};

export const useEditorState = () => {
    const context = useContext(EditorStateContext);
    if (!context) {
        throw new Error("useEditorState must be used within an EditorStateProvider");
    }
    return context;
};

export const EditorStateProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const setContent = (content) => {
        dispatch({ type: "SET_CONTENT", payload: content });
    };

    const markSaved = () => {
        dispatch({ type: "MARK_SAVED" });
    };

    const resetEditor = () => {
        dispatch({ type: "RESET" });
    };

    return (
        <EditorStateContext.Provider
            value={{
                content: state.content,
                saved: state.saved,
                setContent,
                markSaved,
                resetEditor,
            }}
        >
            {children}
        </EditorStateContext.Provider>
    );
};
