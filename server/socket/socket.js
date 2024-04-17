import http from "http";
import { Server } from "socket.io";
import { app } from "../app.js";
import { User } from "../models/user.model.js";

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: `${process.env.CORS_ORIGIN}`,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("login", async (userId) => {
    try {
      await User.findByIdAndUpdate(userId, { isOnline: true });
      socket.userId = userId;
      console.log(`User ${socket.id} connected`);
    } catch (error) {
      console.log("Error while updating Online status\n", error);
    }
  });
  socket.on("disconnect", async () => {
    try {
      if (socket.userId) {
        await User.findByIdAndUpdate(socket.userId, { isOnline: false });
        console.log(`User ${socket.id} disconnected`);
      }
    } catch (error) {
      console.log("Error while updating Online status\n", error);
    }
  });
});

export { server, io };