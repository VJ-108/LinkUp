import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SocketCreate from "../socket/SocketCreate";
import Message from "../components/message";
import SearchUser from "../components/searchUser";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";

const Home = () => {
  const [contact, setContact] = useState([]);
  const [chat, setChat] = useState([]);
  const [isChatPanelVisible, setIsChatPanelVisible] = useState(true);
  const isloggedIn = useSelector((store) => store.user.isloggedIn);

  const navigate = useNavigate();
  const { socket } = SocketCreate();

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
  }, [chat]);

  return (
    <div className="h-screen flex justify-center items-center p-6">
      <div className="mockup-window border bg-base-300 h-full w-full">
        <div className="grid grid-rows-12 grid-cols-3 h-full">
          <div
            className={`border m-2 rounded-lg row-span-11 md:col-span-1 col-span-3 ${
              isChatPanelVisible ? "" : "hidden"
            } md:block`}
          >
            <SearchUser
              setChat={setChat}
              setIsChatPanelVisible={setIsChatPanelVisible}
            />
            <ContactList
              contact={contact}
              setIsChatPanelVisible={setIsChatPanelVisible}
              setChat={setChat}
            />
          </div>
          {chat && (
            <ChatContainer
              chat={chat}
              isChatPanelVisible={isChatPanelVisible}
            />
          )}
          <Message
            socket={socket}
            chat={chat}
            setChat={setChat}
            isChatPanelVisible={isChatPanelVisible}
            setIsChatPanelVisible={setIsChatPanelVisible}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
