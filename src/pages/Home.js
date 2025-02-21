import React from "react";

const Home = () => {
    return <div className="HomePageWrapper">
        <div className="FormWrapper">
            <img src = "/code-sync.png" alt = "code-sync-logo"/>
            <h4 className="MainLabel">Paste Invitation ROOM ID</h4>
            <div className="inputGroup">
                <input 
                     type="test"
                     className="inputBox"
                     placeholder="ROOM ID"
                     />
                <input 
                     type="test"
                     className="inputBox"
                     placeholder="USERNAME"
                     />  
                <button className="btn joinbtn" >Join</button>
                <span className = "createInfo">
                    If you don't have an invite then create &nbsp;
                    <a href = "" className="createNewntn">
                        New Room
                    </a>
                </span>

            </div>
        </div>
        <footer>
            <h4>Build By Team BlockSmiths</h4>
        </footer>
    </div>;
    
};
 
export default Home;