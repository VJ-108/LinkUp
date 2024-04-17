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

const activeUsers = new Set();

io.on("connection", (socket) => {
  socket.on("login", ({ userId, contacts }) => {
    try {
      contacts.forEach((contactId) => {
        if (activeUsers.has(contactId)) {
          activeUsers.add(contactId);
        }
      });
      activeUsers.add(userId);
      io.emit("activeUsers", Array.from(activeUsers));
      console.log("Active Users:", activeUsers);
    } catch (error) {
      console.log("Error while updating Online status\n", error);
    }
  });

  socket.on("disconnect", () => {});
});

export { server, io };
