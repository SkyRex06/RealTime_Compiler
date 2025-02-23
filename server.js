const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const { exec } = require("child_process");
const cors = require("cors");  // Allows frontend to make API calls
const bodyParser = require("body-parser");
const ACTIONS = require("./src/actions");

const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("build"));
app.use(cors());  // Enable CORS
app.use(bodyParser.json()); // To parse JSON requests

app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});

const userSocketMap = {};
function getAllConnectedClients(RoomId) {
    return Array.from(io.sockets.adapter.rooms.get(RoomId) || []).map(
        (socketId) => {
            return {
                socketId,
                USERNAME: userSocketMap[socketId],
            };
        }
    );
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

    socket.on(ACTIONS.CODE_CHANGE, (data) => {
        if (!data || !data.RoomId || !data.code) {
            console.log("Invalid data received:", data);
            return;
        }
        const { RoomId, code } = data;
        console.log("Receiving:", code);
        io.to(RoomId).emit(ACTIONS.CODE_CHANGE, { code });
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

// 🔹 ADDING CODE EXECUTION SUPPORT 🔹
app.post("/run", (req, res) => {
    const { code, language } = req.body;

    let command;
    if (language === "javascript") {
        command = `node -e "${code.replace(/"/g, '\\"')}"`;
    } else if (language === "python") {
        command = `python -c "${code.replace(/"/g, '\\"')}"`;
    } else {
        return res.json({ output: "Unsupported language!" });
    }

    exec(command, (error, stdout, stderr) => {
        if (error) {
            return res.json({ output: stderr });
        }
        res.json({ output: stdout });
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
