const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const ACTIONS = require('./src/actions');

const server = http.createServer(app);
const io = new Server(server);
const userSocketMap = {}; // { username: socketId }

function getAllConnectedClients(RoomID) {
    return Array.from(io.sockets.adapter.rooms.get(RoomID) || []).map((socketId) => {
        const username = Object.keys(userSocketMap).find(key => userSocketMap[key] === socketId);
        return {
            socketId,
            USERNAME: username,
        };
    });
}

io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on(ACTIONS.JOIN, ({ RoomId, USERNAME }) => {
        // Remove the old socket if the same user reconnects
        Object.keys(userSocketMap).forEach((key) => {
            if (userSocketMap[key] === socket.id) {
                delete userSocketMap[key];
            }
        });

        userSocketMap[USERNAME] = socket.id;
        socket.join(RoomId);

        const clients = getAllConnectedClients(RoomId);
        io.to(RoomId).emit(ACTIONS.JOINED, {
            clients,
            USERNAME,
            socketId: socket.id,
        });

        console.log('Updated Clients:', clients);
    });

    socket.on('disconnecting', () => {
        const username = Object.keys(userSocketMap).find(key => userSocketMap[key] === socket.id);
        if (username) {
            delete userSocketMap[username];
        }

        const rooms = [...socket.rooms];
        rooms.forEach((RoomId) => {
            socket.to(RoomId).emit(ACTIONS.DISCONNECTED, {
                socketId: socket.id,
                USERNAME: username,
            });
        });

        console.log(`User ${username} disconnected.`);
    });

    socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));

