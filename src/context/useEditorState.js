import React, { createContext, useContext, useReducer } from "react";
import { debounce } from "lodash";

// Create the EditorStateContext
const EditorStateContext = createContext();

// Initial state for the editor
const initialState = {
    content: "",  // Content of the editor
    saved: true,   // Whether the content is saved
    lastSaved: new Date().toISOString(), // Timestamp for the last save
};

// Default debounce delay time
const DEFAULT_DEBOUNCE_DELAY = 300;

// Reducer function to update the state based on actions
const reducer = (state, action) => {
    switch (action.type) {
        case "SET_CONTENT":
            return { ...state, content: action.payload, saved: false };  // Content change, mark as unsaved
        case "MARK_SAVED":
            return { ...state, saved: true, lastSaved: new Date().toISOString() }; // Mark as saved with timestamp
        case "RESET":
            return { ...initialState, ...action.payload };  // Reset to initial state with optional updates
        default:
            throw new Error(`Unknown action type: ${action.type}`);
    }
};

// Custom hook to access the editor's state
export const useEditorState = () => {
    const context = useContext(EditorStateContext);
    if (!context) {
        throw new Error("useEditorState must be used within an EditorStateProvider");
    }
    return context;
};

// EditorStateProvider component to manage the state and provide it to the app
export const EditorStateProvider = ({ children, debounceDelay = DEFAULT_DEBOUNCE_DELAY }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    // Function to immediately update content (no debounce)
    const setContent = (content) => {
        dispatch({ type: "SET_CONTENT", payload: content });
    };

    // Debounced save action
    const markSaved = debounce(() => {
        dispatch({ type: "MARK_SAVED" });
    }, debounceDelay);

    // Function to reset the editor state
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
