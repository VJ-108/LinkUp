import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const App = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [onlineUsers, setOnlineUsers] = useState({});

  const handleLogin = () => {
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:8000/api/v1/users/login", {
        email: email,
        password: password,
      })
      .then((response) => {
        setUsername(response.data.data?.user?.username);
        setUserId(response.data.data?.user?._id);
      })
      .catch((error) => {
        console.error("Error logging in:", error);
      });
  };

  useEffect(() => {
    if (username !== "" && userId !== "") {
      const socket = io("http://localhost:8000", {
        query: {
          username: username,
          userId: userId,
        },
      });
      socket.on("connect", () => {
        console.log("connected: ", socket.id);
        socket.emit("login");
      });
      socket.on("activeUsers", (users) => {
        setOnlineUsers(users);
      });
      socket.on("disconnect", () => {
        console.log("disconnected: ", socket.id);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [username, userId]);

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
          {Object.keys(onlineUsers).map((username) => (
            <li key={username}>
              Username: {username}, UserId: {onlineUsers[username]}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default App;
