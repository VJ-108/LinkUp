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

io.on("connection", (socket) => {
  socket.on("login", () => {
    try {
      const username = socket.handshake.query.username;
      const userId = socket.handshake.query.userId;
      if (username !== undefined && userId !== undefined) {
        activeUsers[username] = userId;
        io.emit("activeUsers", activeUsers);
        console.log("Active Users:", activeUsers);
      }
    } catch (error) {
      console.log("Error while updating Online status\n", error);
    }
  });

  socket.on("disconnect", () => {});
});

export { server, io };
