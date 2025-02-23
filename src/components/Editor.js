import React, { useEffect, useState } from "react";
import "codemirror/lib/codemirror.css"; // Core CSS
import "codemirror/mode/javascript/javascript"; // JavaScript mode
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import "codemirror/theme/dracula.css";
import CodeMirror from "codemirror";
import { sendCodeChange, subscribeToCodeChanges } from "../socket";

const Editor = ({ socket, roomId }) => {
    const [editor, setEditor] = useState(null);

    useEffect(() => {
        const textarea = document.getElementById("realtimeEditor");

        if (textarea.classList.contains("cm-initialized")) return;

        textarea.classList.add("cm-initialized");

        const cmInstance = CodeMirror.fromTextArea(textarea, {
            mode: { name: "javascript", json: true },
            theme: "dracula",
            autoCloseTags: true,
            autoCloseBrackets: true,
            lineNumbers: true,
        });

        setEditor(cmInstance);

        // Listen for real-time code updates
        if (socket) {
            subscribeToCodeChanges(socket, ({ code }) => {
                if (cmInstance.getValue() !== code) {
                    cmInstance.setValue(code);
                }
            });
        }

        // Send code updates when typing
        cmInstance.on("change", (cm) => {
            const newCode = cm.getValue();
            sendCodeChange(socket, roomId, newCode);
        });

        return () => {
            if (socket) {
                socket.off("code-change");
            }
        };
    }, [socket, roomId]);

    return <textarea id="realtimeEditor"></textarea>;
};

export default Editor;
