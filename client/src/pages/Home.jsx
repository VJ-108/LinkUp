import React, { useEffect, useRef, useState } from "react";
import Message from "../components/message";
import { useSelector } from "react-redux";
import SocketCreate from "../socket/SocketCreate";
import SearchUser from "../components/searchUser";
import axios from "axios";
import useOpenChat from "../hooks/useOpenChat";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [contact, setContact] = useState([]);
  const [chat, setChat] = useState([]);
  const username = useSelector((store) => store.user.User.username);
  const userId = useSelector((store) => store.user.User._id);
  const isloggedIn = useSelector((store) => store.user.isloggedIn);
  const onlineUsers = useSelector((store) => store.socket.onlineUsers);
  const navigate = useNavigate();
  const { socket } = SocketCreate();
  const { openChat } = useOpenChat();
  const chatContainerRef = useRef(null);
  const userChats = () => {
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:8000/api/v1/messages/get-user-chats")
      .then((response) => {
        setContact(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });
  };
  useEffect(() => {
    userChats();
    if (!isloggedIn) {
      navigate("/login");
    }
  }, []);
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chat]);
  return (
    <>
      <SearchUser setChat={setChat} />
      <h2>Contacts: </h2>
      <div>
        {contact.map((chat) => (
          <div key={chat._id}>
            {chat.groupId ? (
              <button
                key={chat.groupId._id}
                className="btn"
                onClick={() => {
                  openChat("group", chat.groupId._id, setChat);
                }}
              >
                {chat.groupId.name}
              </button>
            ) : (
              <>
                {chat.participants.map(
                  (participant) =>
                    participant.username !== username && (
                      <button
                        key={participant._id}
                        className="btn"
                        onClick={() => {
                          openChat("chat", participant._id, setChat);
                        }}
                      >
                        {participant.username}
                      </button>
                    )
                )}
              </>
            )}
          </div>
        ))}
      </div>
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
      <h2>Messages: </h2>
      {chat && (
        <div ref={chatContainerRef} className="border overflow-y-auto h-60">
          {chat.map((chat) => (
            <div
              key={chat._id}
              className={
                chat.senderId === userId ? "text-green-700" : "text-blue-700"
              }
            >
              <div
                className={`chat ${
                  chat.senderId === userId ? "chat-end" : "chat-start"
                }`}
              >
                <div
                  className={`chat-bubble ${
                    chat.senderId === userId
                      ? "chat-bubble-success"
                      : "chat-bubble-primary"
                  }`}
                >
                  {chat.message}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <Message socket={socket} chat={chat} setChat={setChat} />
    </>
  );
};

export default Home;
