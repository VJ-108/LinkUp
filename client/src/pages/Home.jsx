import React, { useEffect, useState } from "react";
import Message from "../components/message";
import { useSelector } from "react-redux";
import SocketCreate from "../socket/SocketCreate";
import SearchUser from "../components/searchUser";
import axios from "axios";

const Home = () => {
  const [chatData, setChatData] = useState([]);
  const username = useSelector((store) => store.user.User.username);
  const onlineUsers = useSelector((store) => store.socket.onlineUsers);
  const { socket } = SocketCreate();
  const userChats = () => {
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:8000/api/v1/messages/get-user-chats")
      .then((response) => {
        setChatData(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });
  };
  useEffect(() => {
    userChats();
  }, []);
  return (
    <>
      <SearchUser />

      <div>
        {chatData.map((chat) => (
          <div key={chat._id}>
            {chat.groupId ? (
              <button key={chat.groupId._id} className="btn">
                Group: {chat.groupId.name}
              </button>
            ) : (
              <>
                {chat.participants.map(
                  (participant) =>
                    participant.username !== username && (
                      <button key={participant._id} className="btn">
                        {participant.username}
                      </button>
                    )
                )}
              </>
            )}
          </div>
        ))}
      </div>
      <h2>Contacts: </h2>
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
