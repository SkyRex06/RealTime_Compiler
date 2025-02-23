import React, { useEffect, useRef, useState } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/python/python'; // ✅ Changed mode to Python
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from '../actions';

const Editor = ({ socketRef, RoomId, onCodeChange }) => {
    const editorRef = useRef(null);
    const [output, setOutput] = useState(''); // ✅ Stores execution output

    useEffect(() => {
        function init() {
            editorRef.current = Codemirror.fromTextArea(
                document.getElementById('realtimeEditor'),
                {
                    mode: { name: 'python', json: true }, // ✅ Now using Python
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
                    socketRef.current.emit(ACTIONS.CODE_CHANGE, { RoomId, code });
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

        const handleCodeOutput = ({ output }) => {
            setOutput(output);
        };

        socketRef.current.on(ACTIONS.CODE_CHANGE, handleCodeChange);
        socketRef.current.on(ACTIONS.CODE_OUTPUT, handleCodeOutput);

        return () => {
            if (socketRef.current) {
                socketRef.current.off(ACTIONS.CODE_CHANGE, handleCodeChange);
                socketRef.current.off(ACTIONS.CODE_OUTPUT, handleCodeOutput);
            }
        };
    }, [socketRef]);

    // ✅ Function to execute Python code
    const runCode = () => {
        if (socketRef.current) {
            const code = editorRef.current.getValue();
            socketRef.current.emit(ACTIONS.RUN_CODE, { RoomId, code });
        }
    };

    return (
        <div>
            <textarea id="realtimeEditor"></textarea>

            {/* ✅ Run Code Button */}
            <button 
                onClick={runCode} 
                style={{ marginTop: '10px', padding: '5px', backgroundColor: '#333', color: '#fff', borderRadius: '5px', cursor: 'pointer' }}>
                Run Code
            </button>

            {/* ✅ Output Terminal */}
            <div style={{
                marginTop: '10px', 
                padding: '10px', 
                backgroundColor: '#222', 
                color: '#0f0', 
                minHeight: '100px', 
                fontFamily: 'monospace', 
                borderRadius: '5px', 
                border: '1px solid #444'
            }}>
                <strong>Output:</strong>
                <pre>{output}</pre> 
            </div>
        </div>
    );
};

export default Editor;
