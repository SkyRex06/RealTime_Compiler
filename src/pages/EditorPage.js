import React, { useState } from "react";
import Client from "../components/Client";

const EditorPage = () => {

        const [clients,setClients]= useState([
                {socketId:1 , USERNAME:'Shivam'},
                {socketId:2 , USERNAME:'Manav'}
        
        
        ]);

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
        
        </div>
        <div className="editorWrap">Editor Goes here...</div>
        </div>
};

export default EditorPage;