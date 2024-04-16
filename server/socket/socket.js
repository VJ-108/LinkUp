import express from "express"
import http from "http";
import { Server } from "socket.io"
import { app } from "../app.js";

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected: ", socket.id);
  socket.on("disconnect", () => {
    console.log("User disconnected: ", socket.id);
  });
});

export { server, io };