import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const PORT = 8080;

// Connect
io.on("connection", (socket) => {
    console.log(`A user connected with ${socket.id}`);

    // Join Room
    socket.on("join-room", (roomId) => {
        socket.join(roomId);
        console.log(`User with I/D: ${socket.id} joined room: ${roomId}`);
    })

    // Message
    socket.on("send-msg", (data) => {
        socket.to(data.roomid).emit("recive-msg", data);
    })

    // Disconnect
    socket.on("disconnect", () => {
        console.log(`A user disconnected with ${socket.id}`);
    })
});

httpServer.listen(PORT, () => {
    console.log(`listening on *:${PORT}`)
});