import { useEffect } from "react";
import "codemirror/lib/codemirror.css"; // Import core CSS
import "codemirror/mode/javascript/javascript"; // Import JavaScript mode
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import "codemirror/theme/dracula.css";
import CodeMirror from "codemirror";

const Editor = () => {
    useEffect(() => {
        const textarea = document.getElementById("realtimeEditor");

        
        if (textarea.classList.contains("cm-initialized")) return;

        textarea.classList.add("cm-initialized");

        CodeMirror.fromTextArea(textarea, {
            mode: { name: "javascript", json: true },
            theme: "dracula",
            autoCloseTags: true,
            autoCloseBrackets: true,
            lineNumbers: true,
        });

    }, []); 

    return <textarea id="realtimeEditor"></textarea>;
};

export default Editor;


