import React, { useEffect, useRef, useState } from "react";
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/python/python";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import ACTIONS from "../actions";
import "./Editor.css"; // Importing CSS for better UI

const Editor = ({ socketRef, RoomId, onCodeChange }) => {
    const editorRef = useRef(null);
    const [output, setOutput] = useState("");
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        async function init() {
            editorRef.current = Codemirror.fromTextArea(
                document.getElementById("realtimeEditor"),
                {
                    mode: { name: "python" },
                    theme: "dracula",
                    autoCloseTags: true,
                    autoCloseBrackets: true,
                    lineNumbers: true,
                }
            );

            editorRef.current.on("change", (instance, changes) => {
                const { origin } = changes;
                const code = instance.getValue();
                onCodeChange(code);

                if (origin !== "setValue" && socketRef.current) {
                    socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                        RoomId,
                        code,
                    });
                }
            });
        }
        init();
    }, []);

    useEffect(() => {
        if (!socketRef.current) return;

        const handleCodeChange = ({ code }) => {
            if (editorRef.current) {
                const currentCode = editorRef.current.getValue();
                if (currentCode !== code) {
                    editorRef.current.setValue(code);
                }
            }
        };

        socketRef.current.on(ACTIONS.CODE_CHANGE, handleCodeChange);
        socketRef.current.on(ACTIONS.CODE_OUTPUT, ({ output }) => {
            setOutput(output);
            setIsRunning(false); // Stop loader
        });

        return () => {
            socketRef.current.off(ACTIONS.CODE_CHANGE, handleCodeChange);
            socketRef.current.off(ACTIONS.CODE_OUTPUT);
        };
    }, [socketRef]);

    const runCode = () => {
        setIsRunning(true);
        const code = editorRef.current.getValue();
        socketRef.current.emit(ACTIONS.RUN_CODE, { RoomId, code });
    };

    return (
        <div className="editor-container">
            <textarea id="realtimeEditor"></textarea>
            <button className={`run-button ${isRunning ? "running" : ""}`} onClick={runCode}>
                {isRunning ? "Running..." : "Run Code"}
            </button>
            <div className="output-section">
                <h3>Output:</h3>
                <pre>{output}</pre>
            </div>
        </div>
    );
};

export default Editor;