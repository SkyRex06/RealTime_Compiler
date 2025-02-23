const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const ACTIONS = require('./src/actions');

const server = http.createServer(app);
const io = new Server(server);
const userSocketMap = {}; // { socketId: username }

function getAllConnectedClients(RoomID) {
    return Array.from(io.sockets.adapter.rooms.get(RoomID) || [])
        .filter(socketId => userSocketMap[socketId]) // Only include valid usernames
        .map(socketId => ({
            socketId,
            USERNAME: userSocketMap[socketId],
        }));
}

io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on(ACTIONS.JOIN, ({ RoomId, USERNAME }) => {
        if (!USERNAME) {
            console.log(`Invalid username for socket ${socket.id}`);
            return;
        }

        // Remove old socket if username already exists
        Object.keys(userSocketMap).forEach((key) => {
            if (userSocketMap[key] === USERNAME) {
                delete userSocketMap[key];
            }
        });

        // Store the new socket mapping
        userSocketMap[socket.id] = USERNAME;
        socket.join(RoomId);

        const clients = getAllConnectedClients(RoomId);
        console.log('Updated Clients:', clients);

        io.to(RoomId).emit(ACTIONS.JOINED, {
            clients,
            USERNAME,
            socketId: socket.id,
        });
    });

    socket.on('disconnecting', () => {
        const username = userSocketMap[socket.id];

        if (!username) return;

        const rooms = [...socket.rooms];

        rooms.forEach((RoomId) => {
            socket.to(RoomId).emit(ACTIONS.DISCONNECTED, {
                socketId: socket.id,
                USERNAME: username,
            });
        });

        delete userSocketMap[socket.id];
        console.log(`User ${username} disconnected.`);
    });

    socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
