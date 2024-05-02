import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleChatPanelVisibility } from "../store/slices/chatSlice";

const ChatContainer = () => {
  const dispatch = useDispatch();
  const chat = useSelector((store) => store.chat.chats);
  const chatContainerRef = useRef(null);
  const userId = useSelector((store) => store.user.User._id);
  const receiver = useSelector((store) => store.user.currentReceiver.username);
  const isChatPanelVisible = useSelector(
    (store) => store.chat.isChatPanelVisible
  );
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chat]);
  return (
    <div
      ref={chatContainerRef}
      className={`border border-gray-800 overflow-y-auto relative m-2 rounded-lg row-span-10 md:col-span-2 col-span-3 ${
        isChatPanelVisible ? "hidden md:block" : ""
      }`}
    >
      <div
        className="flex justify-center items-center sticky top-0 left-0 bg-base-100 h-10 z-50 cursor-pointer text-white"
        onClick={() => {
          if (window.innerWidth <= 768) {
            dispatch(toggleChatPanelVisibility());
          }
        }}
      >
        {receiver}
      </div>
      {chat.map((chat) => (
        <div
          key={chat._id}
          className={`md:m-12 break-words ${
            chat.senderId === userId
              ? "text-green-700 ml-4 mr-2 my-8 md:mr-4"
              : "text-blue-700  mr-4 ml-2 my-8 md:ml-4"
          }`}
        >
          <div
            className={`chat ${
              chat.senderId === userId ? "chat-end" : "chat-start"
            }`}
          >
            <div
              className={`chat-bubble md:p-6 font-medium text-sm ${
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
  );
};

export default ChatContainer;
