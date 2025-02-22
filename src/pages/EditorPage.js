import React, { useState , useRef,useEffect} from "react";
import toast from "react-hot-toast";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket } from "../socket";
import ACTIONS from "../actions";
import { Navigate, useLocation,useNavigate, useParams } from "react-router-dom";

const EditorPage = () => {
        const socketRef = useRef(null);
        const location = useLocation();
        const {RoomId} = useParams();
        const reactNavigator = useNavigate();
        useEffect(() => {
            const init = async () => {
                socketRef.current = await initSocket();
                socketRef.current.on('connect_error',(err) => handleErrors(err))
                socketRef.current.on('connect_failed ',(err) => handleErrors(err))

 
                function handleErrors(err) {
                        console.log('socket error',err);
                        toast.error('Socket connection failed , try again later');
                        reactNavigator('/');
                }

                socketRef.current.emit(ACTIONS.join, {
                        RoomId,
                        USERNAME:location.state?.USERNAME,

                });
            };
    
            init();
        }, []);
        
    
        const [clients,setClients]= useState([
                {socketId:1 , USERNAME:'Shivam'},
                {socketId:2 , USERNAME:'Manav'}
        
        
        ]);

        if (!location.state) {
                return <Navigate to="/ "/>
        }

        return <div className="mainWrap">
        <div className="aside">
                <div className="asideInner">
                        <div className="logo">
                                <img className="logoImage" src ="/code-sync.png" alt="logo"/>
                        </div>
                        <h3>Connected</h3>
                        <div className="clientsList" >
                                {
                                        clients.map((clients) => (
                                                <Client key={clients.socketId} USERNAME={clients.USERNAME}/>
                                        ))}
                        </div>
                </div>
        <button className="btn copyBtn">Copy RoomID</button>
        <button className="btn leaveBtn">Leave</button>
        </div>
        <div className="editorWrap">
                <Editor/>
        </div>
        </div>
};

export default EditorPage;