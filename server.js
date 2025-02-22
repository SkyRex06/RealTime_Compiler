const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const ACTIONS = require('./src/actions');

const server = http.createServer(app);
const io = new Server(server);
const userSocketMap ={};

function getAllConnnectedClients(RoomID){
    return Array.from(io.sockets.adapter.rooms.get(RoomID) || []).map((socketId) =>{
        return{ 
            socketId,
            USERNAME: userSocketMap[socketId],
        }
    });
}

io.on('connection', (socket) => {
    console.log('socket connected', socket.id);
    socket.on(ACTIONS.JOIN,({RoomId,USERNAME}) => {
        userSocketMap[socket.id] = USERNAME;
        socket.join(RoomId); 
        const clients = getAllConnnectedClients(RoomId);
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));

