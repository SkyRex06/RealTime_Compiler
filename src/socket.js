import { io } from "socket.io-client";

export const initSocket = async () => {
    const options = {
        "force new connection": true,
        reconnectionAttempts: "Infinity",
        timeout: 10000,
        transports: ["websocket"],
    };
    return io(process.env.REACT_APP_BACKEND_URL, options);
};

// Send code changes to the server
export const sendCodeChange = (socket, roomId, code) => {
    if (socket) {
        socket.emit("code-change", { roomId, code });
    }
};

// Listen for incoming code changes
export const subscribeToCodeChanges = (socket, callback) => {
    if (socket) {
        socket.on("code-change", callback);
    }
};
