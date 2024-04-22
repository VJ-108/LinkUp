import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
const useLogin = () => {
  const [userId, setUserId] = useState("");
  const [onlineUsers, setOnlineUsers] = useState({});
  const [socket, setSocket] = useState(null);
  const login = (email, password) => {
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:8000/api/v1/users/login", {
        email: email,
        password: password,
      })
      .then((response) => {
        setUserId(response.data.data?.user?._id);
      })
      .catch((error) => {
        console.error("Error logging in:", error);
      });
  };
  useEffect(() => {
    if (userId !== "") {
      const newSocket = io("http://localhost:8000", {
        query: {
          userId: userId,
        },
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
  return { onlineUsers, socket, login };
};

export default useLogin;
