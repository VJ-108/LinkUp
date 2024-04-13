import React, { useEffect } from "react";
import { io } from "socket.io-client";

const App = () => {
  const socket = io("http://localhost:8000");
  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected: ",socket.id);
    });
  }, []);
  return <div>App</div>;
};

export default App;
