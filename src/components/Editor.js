import React, { useEffect, useRef } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from '../actions';

const Editor = ({ socketRef, RoomId, onCodeChange }) => {
    const editorRef = useRef(null);
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
                console.log('changes',changes);
                const { origin } = changes;
                const code = instance.getValue();
                onCodeChange(code);
                console.log(code);
                if (origin!== 'setValue'){
                    socketRef.current.emit(ACTIONS.CODE_CHANGE,
                        RoomId,
                        code,
                    )
                }
                

            });
        }
        init();

    }, []);

    useEffect(() => {
        if (!socketRef.current) return;
    
        const handleCodeChange = ({ code }) => {
            if (code !== null && editorRef.current) {
                editorRef.current.setValue(code);
            }
        };
    
        socketRef.current.on(ACTIONS.CODE_CHANGE, handleCodeChange);
    
        return () => {
            // ✅ Ensure socketRef.current is valid before calling 'off'
            if (socketRef.current) {
                socketRef.current.off(ACTIONS.CODE_CHANGE, handleCodeChange);
            }
        };
    }, [socketRef]); // ✅ Correct dependency
    
    

    return <textarea id="realtimeEditor"></textarea>;
};

export default Editor;