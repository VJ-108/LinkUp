import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketCreate = (userId) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState({});
  useEffect(() => {
    if (userId) {
      const newSocket = io("http://localhost:8000", {
        query: { userId: userId },
      });
      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log("connected: ", newSocket.id);
      });
      newSocket.on("activeUsers", (users) => {
        setOnlineUsers(users);
      });
      newSocket.on("disconnect", () => {
        console.log("disconnected: ", newSocket.id);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [userId]);

  return { onlineUsers, socket };
};

export default SocketCreate;
