import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket } from "../socket";
import ACTIONS from "../actions";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";

const EditorPage = () => {
    const socketRef = useRef(null);
    const codeRef = useRef(null)
    const location = useLocation();
    const { RoomId } = useParams();
    const reactNavigator = useNavigate();
    const [clients, setClients] = useState([]);

    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();
            
            function handleErrors(err) {
                console.log('Socket error:', err);
                toast.error('Socket connection failed, try again later');
                reactNavigator('/');
            }

            socketRef.current.on('connect_error', handleErrors);
            socketRef.current.on('connect_failed', handleErrors); // ✅ Fixed extra space
            
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
                socketRef.current.emit(ACTIONS.SYNC_CODE, {});
            });

            //Listening for disconnected
            socketRef.current.on(ACTIONS.DISCONNECTED, ({socketId, USERNAME }) => {
                toast.success(`${USERNAME} left the room`);
                setClients((prev) => {
                    return prev.filter(client =>client.socketId !== socketId

                     );
                })
                   
            })
        };

        init();

        return () => {
            socketRef.current?.disconnect();
        };
    }, []);

    async function copyRoomId() {
        try{

            await navigator.clipboard.writeText(RoomId);
            toast.success('Room Id has been copied to your clipboard ');


        } catch(err) {
            toast.error('Could not copy the Room Id');
            console.error(err);


        }

    }

    function leaveRoom() {

        reactNavigator('/');
    }

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
                            <p>No users connected</p> // ✅ Added debug text
                        )}
                    </div>
                </div>
                <button className="btn copyBtn" onClick={copyRoomId}>
                    Copy RoomID
                    </button>
                <button className="btn leaveBtn"onClick={leaveRoom}>Leave</button>
            </div>
            <div className="editorWrap">
                <Editor socketRef={socketRef} RoomId={RoomId}
                 onCodeChange={(code) => {codeRef.current =code}}
                 />
            </div>
        </div>
    );
};

export default EditorPage;