import React, { useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const App = () => {
  useEffect(() => {
    axios.defaults.withCredentials = true;
    // POST request to login
    axios
      .post("http://localhost:8000/api/v1/users/login", {
        email: "hello@1234",
        password: "12345678",
      })
      .then((response) => {
        console.log("Login response:", response.data);

        // Assuming login was successful, make GET request to get user ID
        axios
          .post("http://localhost:8000/api/v1/users/get-user-Id", {
            username: "hello",
          })
          .then((userIdResponse) => {
            console.log("User ID response:", userIdResponse.data);
          })
          .catch((error) => {
            console.error("Error fetching user ID:", error);
          });
      })
      .catch((error) => {
        console.error("Error logging in:", error);
      });
  }, []);

  const socket = io("http://localhost:8000");

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected: ", socket.id);
    });
  }, []);

  return <div>App</div>;
};

export default App;
