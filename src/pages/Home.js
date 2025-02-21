import React, { useState} from "react";
import {v4 as uuidV4} from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();
    const [ RoomId , setRoomId] = useState('')
    const [ USERNAME , setUsername] = useState('')

    const createNewRoom = (e) => {
        e.preventDefault();
        const id = uuidV4();
        setRoomId(id);
        toast.success('Created a new room')

    }

    const joinRoom = () => {
        if (!RoomId || !USERNAME) {
            toast.error('ROOM ID & username is required');
            return;
        }

        // Redirect
        navigate(`/editor/${RoomId}`, {
            state: {
                USERNAME,
            },
        });
    }

 
    return <div className="HomePageWrapper">
        <div className="FormWrapper">
            <img className= "homepagelogo" src = "/code-sync.png" alt = "code-sync-logo"/>
            <h4 className="MainLabel">Paste Invitation ROOM ID</h4>
            <div className="inputGroup">
                <input 
                     type="test"
                     className="inputBox"
                     placeholder="ROOM ID"
                     onChange={(e) => setRoomId(e.target.value)}
                     value={RoomId}
                     />
                <input 
                     type="test"
                     className="inputBox"
                     placeholder="USERNAME"
                     onChange={(e) => setUsername(e.target.value)}
                     value={USERNAME}
                     />  
                <button className="btn joinbtn" onClick={joinRoom} >Join</button>
                <span className = "createInfo">
                    If you don't have an invite then create &nbsp;
                    <a onClick={createNewRoom} href = "" className="createNewBtn">
                        New Room
                    </a>
                </span>

            </div>
        </div>
        <footer>
            <h4>Built by Team BlockSmiths</h4>
        </footer>
    </div>;
    
};
 
export default Home;
 