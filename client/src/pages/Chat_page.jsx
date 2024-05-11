import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SocketCreate from "../socket/SocketCreate";
import Message from "../components/message";
import SearchUser from "../components/searchUser";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import useGetUserChats from "../hooks/useGetUserChats";

const Chat_page = () => {
  const chat = useSelector((store) => store.chat.chats);
  const isloggedIn = useSelector((store) => store.user.isloggedIn);
  const isChatPanelVisible = useSelector(
    (store) => store.chat.isChatPanelVisible
  );

  const navigate = useNavigate();
  const { socket } = SocketCreate();

  const { userChats } = useGetUserChats();

  useEffect(() => {
    if (!isloggedIn) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    userChats();
  }, [chat]);

  return (
    <div className="h-screen flex justify-center items-center p-6 bg-gradient-to-r from-black via-gray-900 to-black">
      <div className="mockup-window border border-gray-800 h-full w-full bg-gradient-to-r from-black via-gray-900 to-black">
        <div className="grid grid-rows-12 grid-cols-3 h-full">
          <div
            className={`border border-gray-800 m-2 rounded-lg row-span-11 md:col-span-1 col-span-3 ${
              isChatPanelVisible ? "" : "hidden"
            } md:block`}
          >
            <SearchUser />
            <ContactList />
          </div>
          {chat && <ChatContainer />}
          <Message socket={socket} />
        </div>
      </div>
    </div>
  );
};

export default Chat_page;
