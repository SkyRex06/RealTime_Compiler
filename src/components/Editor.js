import React, { useEffect, useRef, useState } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/python/python';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from '../actions';

const Editor = ({ socketRef, RoomId, onCodeChange }) => {
    const editorRef = useRef(null);
    const [output, setOutput] = useState("");

    useEffect(() => {
        async function init() {
            editorRef.current = Codemirror.fromTextArea(
                document.getElementById('realtimeEditor'),
                {
                    mode: { name: 'python' },
                    theme: 'dracula',
                    autoCloseTags: true,
                    autoCloseBrackets: true,
                    lineNumbers: true,
                }
            );

            editorRef.current.on('change', (instance, changes) => {
                const { origin } = changes;
                const code = instance.getValue();
                onCodeChange(code);

                if (origin !== 'setValue' && socketRef.current) {
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
        socketRef.current.on(ACTIONS.CODE_OUTPUT, ({ output }) => setOutput(output));

        return () => {
            socketRef.current.off(ACTIONS.CODE_CHANGE, handleCodeChange);
            socketRef.current.off(ACTIONS.CODE_OUTPUT);
        };
    }, [socketRef]);

    const runCode = () => {
        const code = editorRef.current.getValue();
        socketRef.current.emit(ACTIONS.RUN_CODE, { RoomId, code });
    };

    return (
        <div>
            <textarea id="realtimeEditor"></textarea>
            <button onClick={runCode} style={{ marginTop: "10px", padding: "5px 10px", background: "green", color: "white" }}>Run Code</button>
            <pre style={{ background: "#282a36", color: "#50fa7b", padding: "10px", marginTop: "10px" }}>{output}</pre>
        </div>
    );
};

export default Editor;