import React, { useEffect, useRef, useState } from "react";
import Message from "../components/message";
import { useDispatch, useSelector } from "react-redux";
import SocketCreate from "../socket/SocketCreate";
import SearchUser from "../components/searchUser";
import axios from "axios";
import useOpenChat from "../hooks/useOpenChat";
import { useNavigate } from "react-router-dom";
import { setCurrentGroup, setCurrentReceiver } from "../store/slices/userSlice";

const Home = () => {
  const [contact, setContact] = useState([]);
  const [chat, setChat] = useState([]);
  const dispatch = useDispatch();
  const username = useSelector((store) => store.user.User.username);
  const userId = useSelector((store) => store.user.User._id);
  const isloggedIn = useSelector((store) => store.user.isloggedIn);
  const onlineUsers = useSelector((store) => store.socket.onlineUsers);
  const receiver = useSelector((store) => store.user.currentReceiver.username);
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
    if (!isloggedIn) {
      navigate("/login");
    }
  }, []);
  useEffect(() => {
    userChats();
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chat]);
  return (
    <>
      <h1 className="text-center">user: {username}</h1>
      <SearchUser setChat={setChat} />
      <h2>Chats: </h2>
      <div>
        {contact.map((chat) => (
          <div key={chat._id}>
            {chat.groupId ? (
              <button
                key={chat.groupId._id}
                className="btn"
                onClick={() => {
                  dispatch(setCurrentGroup(chat.groupId._id));
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
                          dispatch(setCurrentReceiver(participant));
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
      <h2>Messages: </h2>
      {chat && (
        <div ref={chatContainerRef} className="border overflow-y-auto h-60">
          <h1 className="text-center">receiver: {receiver}</h1>
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
