const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const ACTIONS = require('./src/actions');

const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('build'));
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const userSocketMap = {};
function getAllConnectedClients(RoomId) {
    // Map
    return Array.from(io.sockets.adapter.rooms.get(RoomId) || []).map(
        (socketId) => {
            return {
                socketId,
                USERNAME: userSocketMap[socketId],
            };
        }
    );
}

io.on('connection', (socket) => {
    console.log('socket connected', socket.id);

    socket.on(ACTIONS.JOIN, ({ RoomId, USERNAME }) => {
        userSocketMap[socket.id] = USERNAME;
        socket.join(RoomId);
        const clients = getAllConnectedClients(RoomId);
        clients.forEach(({ socketId }) => {
            io.to(socketId).emit(ACTIONS.JOINED, {
                clients,
                USERNAME,
                socketId: socket.id,
            });
        });
    });

    socket.on(ACTIONS.CODE_CHANGE, ({ RoomId,code}) =>{
        socket.in(RoomId).emit(ACTIONS.CODE_CHANGE,{code});
    });

    socket.on(ACTIONS.SYNC_CODE, ({socketId,code}) =>{
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, {code});
    });
    
    
    

    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];
        rooms.forEach((RoomId) => {
            socket.in(RoomId).emit(ACTIONS.DISCONNECTED, {
                socketId: socket.id,
                USERNAME: userSocketMap[socket.id],
            });
        });
        delete userSocketMap[socket.id];
        socket.leave();
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));