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
                console.log(code);
                if (origin!== 'setValue'){
                    socketRef.current.emit(ACTIONS.CODE_CHANGE,
                        RoomId,
                        code,
                    )
                }
                

            });

            socketRef.current(ACTIONS.CODE_CHANGE,({}) =>{
                if (code !==null) {
                    
                }
            })
        }
        init();
    }, []);

    

    return <textarea id="realtimeEditor"></textarea>;
};

export default Editor;

