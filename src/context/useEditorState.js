import React, { createContext, useContext, useReducer } from "react";
import { debounce } from "lodash";

const EditorStateContext = createContext();

const initialState = {
    content: "", // Default content for the editor
    saved: true, // Tracks if content is saved
    lastSaved: new Date().toISOString(), // Timestamp for the last save
};

const DEFAULT_DEBOUNCE_DELAY = 300;

const reducer = (state, action) => {
    switch (action.type) {
        case "SET_CONTENT":
            return { ...state, content: action.payload, saved: false };
        case "MARK_SAVED":
            return { ...state, saved: true, lastSaved: new Date().toISOString() };
        case "RESET":
            return { ...initialState, ...action.payload };
        default:
            throw new Error(`Unknown action type: ${action.type}`);
    }
};

export const useEditorState = () => {
    const context = useContext(EditorStateContext);
    if (!context) {
        throw new Error("useEditorState must be used within an EditorStateProvider");
    }
    return context;
};

export const EditorStateProvider = ({ children, debounceDelay = DEFAULT_DEBOUNCE_DELAY }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const setContent = debounce((content) => {
        dispatch({ type: "SET_CONTENT", payload: content });
    }, debounceDelay);

    const markSaved = () => {
        dispatch({ type: "MARK_SAVED" });
    };

    const resetEditor = (payload = {}) => {
        dispatch({ type: "RESET", payload });
    };

    return (
        <EditorStateContext.Provider
            value={{
                content: state.content,
                saved: state.saved,
                lastSaved: state.lastSaved,
                setContent,
                markSaved,
                resetEditor,
            }}
        >
            {children}
        </EditorStateContext.Provider>
    );
};
