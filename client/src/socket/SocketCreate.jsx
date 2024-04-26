import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { OnlineUsers } from "../store/slices/socketSlice";

const SocketCreate = () => {
  const userId = useSelector((store) => store.user.User._id);
  const dispatch = useDispatch();
  const [socket, setSocket] = useState(null);

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
        dispatch(OnlineUsers(users));
      });
      newSocket.on("disconnect", () => {
        console.log("disconnected: ", newSocket.id);
      });

      return () => {
        // newSocket.disconnect();
      };
    }
  }, [dispatch, userId]);

  return { socket };
};

export default SocketCreate;
