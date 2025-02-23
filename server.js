const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const { exec } = require("child_process");
const cors = require("cors");
const bodyParser = require("body-parser");
const ACTIONS = require("./src/actions");

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

app.use(express.static("build"));
app.use(cors());
app.use(bodyParser.json());

app.use((req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});

const userSocketMap = {};
function getAllConnectedClients(RoomId) {
    return Array.from(io.sockets.adapter.rooms.get(RoomId) || []).map((socketId) => ({
        socketId,
        USERNAME: userSocketMap[socketId],
    }));
}

io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

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

    socket.on(ACTIONS.CODE_CHANGE, ({ RoomId, code }) => {
        io.to(RoomId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    // Code execution
    socket.on(ACTIONS.RUN_CODE, ({ RoomId, code }) => {
        exec(`python -c "${code.replace(/"/g, '\\"')}"`, (error, stdout, stderr) => {
            io.to(RoomId).emit(ACTIONS.CODE_OUTPUT, { output: error ? stderr : stdout });
        });
    });

    socket.on("disconnecting", () => {
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
