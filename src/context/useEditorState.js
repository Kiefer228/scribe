import React, { createContext, useContext, useReducer } from "react";
import { debounce } from "lodash";
import { createHash } from "crypto";

const EditorStateContext = createContext();

const initialState = {
    content: "", // Default content for the editor
    contentHash: "", // Hash of the content to track changes
    saved: true, // Tracks if content is saved
    lastSaved: new Date().toISOString(), // Timestamp for the last save
};

const DEFAULT_DEBOUNCE_DELAY = 300;

const hashContent = (content) => {
    return createHash("sha256").update(content).digest("hex");
};

const logErrorToService = (error) => {
    // Replace with integration for logging errors (e.g., Sentry, LogRocket, etc.)
    console.error("Logging to external service:", error);
};

const validatePayload = (payload) => {
    if (typeof payload !== "object" || payload === null) {
        throw new Error("Payload must be a non-null object.");
    }
    if (payload.content && typeof payload.content !== "string") {
        throw new Error("Payload 'content' must be a string.");
    }
    if (payload.saved !== undefined && typeof payload.saved !== "boolean") {
        throw new Error("Payload 'saved' must be a boolean.");
    }
    if (payload.lastSaved !== undefined && typeof payload.lastSaved !== "string") {
        throw new Error("Payload 'lastSaved' must be a string.");
    }
};

const reducer = (state, action) => {
    switch (action.type) {
        case "SET_CONTENT":
            return { ...state, content: action.payload, contentHash: hashContent(action.payload), saved: false };
        case "MARK_SAVED":
            return { ...state, saved: true, lastSaved: new Date().toISOString() };
        case "RESET":
            validatePayload(action.payload);
            return { ...initialState, ...action.payload };
        default:
            const error = new Error(`[useEditorState] Unknown action type: ${action.type}`);
            logErrorToService(error);
            throw error;
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
        const newContentHash = hashContent(content);
        if (newContentHash !== state.contentHash) {
            dispatch({ type: "SET_CONTENT", payload: content });
        }
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
