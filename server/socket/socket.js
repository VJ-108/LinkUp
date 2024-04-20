import http from "http";
import { Server } from "socket.io";
import { app } from "../app.js";

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: `${process.env.CORS_ORIGIN}`,
    credentials: true,
  },
});

const activeUsers = {};

export const getReceiverSocketId = (receiverId) => {
  return activeUsers[receiverId];
}

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId !== undefined) {
    activeUsers[userId] = socket.id;
    io.emit("activeUsers", activeUsers);
    console.log("Active Users:", activeUsers);
  }

  socket.on("disconnect", () => {
    console.log("Active Users:", activeUsers);
    delete activeUsers[userId];
    io.emit("activeUsers", activeUsers);
  });
});

export { server, io };
