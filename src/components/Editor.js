import React, { useEffect, useRef, useState } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from '../actions';

const Editor = ({ socketRef, RoomId, onCodeChange }) => {
    const editorRef = useRef(null);
    const [output, setOutput] = useState('');  // ✅ State to store output

    useEffect(() => {
        async function init() {
            editorRef.current = Codemirror.fromTextArea(
                document.getElementById('realtimeEditor'),
                {
                    mode: { name: 'javascript', json: true },
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
                
                if (origin !== 'setValue') {
                    socketRef.current.emit(ACTIONS.CODE_CHANGE, { RoomId, code });
                }
            });
        }
        init();
    }, []);

    // ✅ Listen for execution output from server
    useEffect(() => {
        if (!socketRef.current) return;

        socketRef.current.on(ACTIONS.CODE_OUTPUT, (data) => {
            setOutput(data.output); // ✅ Update output
        });

        return () => {
            socketRef.current.off(ACTIONS.CODE_OUTPUT);
        };
    }, [socketRef]);

    // ✅ Add a button to run the code
    const runCode = () => {
        const code = editorRef.current.getValue();
        socketRef.current.emit(ACTIONS.RUN_CODE, { RoomId, code });
    };

    return (
        <div>
            <textarea id="realtimeEditor"></textarea>
            <button onClick={runCode} style={{ marginTop: '10px', padding: '5px', backgroundColor: '#333', color: '#fff' }}>
                Run Code
            </button>
            <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#222', color: '#0f0', minHeight: '100px', fontFamily: 'monospace' }}>
                <strong>Output:</strong>
                <pre>{output}</pre> {/* ✅ Display output */}
            </div>
        </div>
    );
};

export default Editor;
