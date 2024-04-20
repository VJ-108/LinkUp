import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import Message from "./message";

const App = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState("");
  const [onlineUsers, setOnlineUsers] = useState({});
  const [socket, setSocket] = useState(null);

  const handleLogin = () => {
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

  return (
    <>
      <div>App</div>
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>

      <div>
        <h2>Active Users:</h2>
        <ul>
          {Object.keys(onlineUsers).map((userId) => (
            <li key={userId}>
              userId: {userId}, SocketId: {onlineUsers[userId]}
            </li>
          ))}
        </ul>
        <Message socket={socket} />
      </div>
    </>
  );
};

export default App;
