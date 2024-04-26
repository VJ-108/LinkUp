import React from "react";
import Message from "../components/message";
import { useSelector } from "react-redux";
import SocketCreate from "../socket/SocketCreate";

const Home = () => {
  const onlineUsers = useSelector((store) => store.socket.onlineUsers);
  const { socket } = SocketCreate();
  return (
    <>
      <div>
        <h2>Active Users:</h2>
        <ul>
          {Object.keys(onlineUsers).map((userId) => (
            <li key={userId}>
              userId: {userId}, SocketId: {onlineUsers[userId]}
            </li>
          ))}
        </ul>
      </div>
      <Message socket={socket} />
    </>
  );
};

export default Home;
