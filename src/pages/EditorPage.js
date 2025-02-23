import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket } from "../socket";
import ACTIONS from "../actions";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";

const EditorPage = () => {
    const socketRef = useRef(null);
    const location = useLocation();
    const { RoomId } = useParams();
    const reactNavigator = useNavigate();
    const [clients, setClients] = useState([]);
    const codeRef = useRef(""); // Store the latest code

    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();

            function handleErrors(err) {
                console.log('Socket error:', err);
                toast.error('Socket connection failed, try again later');
                reactNavigator('/');
            }

            socketRef.current.on('connect_error', handleErrors);
            socketRef.current.on('connect_failed', handleErrors);

            socketRef.current.emit(ACTIONS.JOIN, {
                RoomId,
                USERNAME: location.state?.USERNAME,
            });

            socketRef.current.on(ACTIONS.JOINED, ({ clients, USERNAME, socketId }) => {
                console.log("Updated Clients List:", clients);

                if (USERNAME !== location.state?.USERNAME) {
                    toast.success(`${USERNAME} joined the room.`);
                    console.log(`${USERNAME} joined`);
                }

                setClients(clients);
                socketRef.current.emit(ACTIONS.SYNC_CODE, {
                    code: codeRef.current, // Send the latest code to new users
                    socketId,
                });
            });

            // Listening for code synchronization
            socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
                codeRef.current = code;
            });

            // Listening for disconnected users
            socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, USERNAME }) => {
                toast.success(`${USERNAME} left the room`);
                setClients((prev) => prev.filter(client => client.socketId !== socketId));
            });
        };

        init();

        return () => {
            socketRef.current?.disconnect();
            socketRef.current?.off(ACTIONS.JOINED);
            socketRef.current?.off(ACTIONS.DISCONNECTED);
            socketRef.current?.off(ACTIONS.CODE_CHANGE);
        };
    }, []);

    if (!location.state) {
        return <Navigate to="/" />;
    }

    return (
        <div className="mainWrap">
            <div className="aside">
                <div className="asideInner">
                    <div className="logo">
                        <img className="logoImage" src="/code-sync.png" alt="logo" />
                    </div>
                    <h3>Connected</h3>
                    <div className="clientsList">
                        {clients.length > 0 ? (
                            clients.map((client) => (
                                <Client key={client.socketId} USERNAME={client.USERNAME} />
                            ))
                        ) : (
                            <p>No users connected</p>
                        )}
                    </div>
                </div>
                <button className="btn copyBtn">Copy RoomID</button>
                <button className="btn leaveBtn">Leave</button>
            </div>
            <div className="editorWrap">
                <Editor socketRef={socketRef} RoomId={RoomId} />
            </div>
        </div>
    );
};

export default EditorPage;