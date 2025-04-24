import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

// Add explicit route to root to prevent any potential conflicts
app.get("/", (req, res) => {
  res.send("Socket server is running");
});

// const io = new Server(server, {
//   cors: {
//     origin: ["http://localhost:5173"],
//     methods: ["GET", "POST"]
//   },
//   // Add explicit path for Socket.io to avoid conflicts
//   path: "/socket.io/"
// });
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
  path: "/socket.io/" // Add this line
});

const userSocketMap = {};

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };