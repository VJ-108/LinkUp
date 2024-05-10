import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setOfflineMessages,
  setShowParticipant,
  toggleChatPanelVisibility,
} from "../store/slices/chatSlice";
import GroupParticipants from "./GroupParticipants";

const ChatContainer = () => {
  const dispatch = useDispatch();
  const chats = useSelector((store) => store.chat.chats);
  const chatContainerRef = useRef(null);
  const userId = useSelector((store) => store.user.User._id);
  const receiver = useSelector((store) => store.user.currentReceiver.username);
  const receiverId = useSelector((store) => store.user.currentReceiver._id);
  const group = useSelector((store) => store.user.currentGroup.name);
  const showParticipant = useSelector((store) => store.chat.showParticipant);
  const onlineUsers = useSelector((store) => store.socket.onlineUsers);
  const isTyping = useSelector((store) => store.chat.isTyping);
  const offlineMessages = useSelector((store) => store.chat.offlineMessages);
  const isChatPanelVisible = useSelector(
    (store) => store.chat.isChatPanelVisible
  );
  const isOnline = Object.keys(onlineUsers).some(
    (userId) => receiverId === userId
  );

  useEffect(() => {
    let waiting = setTimeout(() => {
      if (receiverId) {
        const updatedOfflineMessages = {
          ...offlineMessages,
          [receiverId]: 0,
        };
        dispatch(setOfflineMessages(updatedOfflineMessages));
        localStorage.setItem(
          "offlineMessages",
          JSON.stringify(updatedOfflineMessages)
        );
      }
    }, 5000);
    return () => clearTimeout(waiting);
  }, [receiverId]);
  var count = 0;
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chats]);

  return showParticipant ? (
    <GroupParticipants />
  ) : (
    <div
      ref={chatContainerRef}
      className={`border border-gray-800 overflow-y-auto relative m-2 rounded-lg row-span-10 md:col-span-2 col-span-3 ${
        isChatPanelVisible ? "hidden md:block" : ""
      }`}
    >
      <div className="navbar sticky top-0 left-0 bg-base-100 h-10 z-50 text-white">
        <div
          className="navbar-start w-10 cursor-pointer block md:hidden"
          onClick={() => {
            if (window.innerWidth <= 768) {
              dispatch(toggleChatPanelVisibility());
            }
          }}
        >
          <svg
            className="h-6 w-6 fill-current md:h-8 md:w-8"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"></path>
          </svg>
        </div>
        <div className="navbar-center">
          {isOnline && (
            <div
              className={`h-4 w-4 rounded-full bg-green-600 ${
                receiver ? "block" : "hidden"
              }`}
            ></div>
          )}
          <a
            className="btn btn-ghost text-xl"
            onClick={() =>
              group
                ? dispatch(setShowParticipant(true))
                : dispatch(setShowParticipant(false))
            }
          >
            {receiver ? receiver : group}
          </a>
        </div>
      </div>
      {chats &&
        chats.map((chat) => {
          count++;
          return (
            <div key={chat._id}>
              {count + offlineMessages[receiverId] - 1 === chats.length && (
                <div className="text-center text-lg">New Message</div>
              )}
              <div
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
                    className={`chat-bubble md:p-5 font-medium text-sm ${
                      chat.senderId === userId
                        ? "chat-bubble-success"
                        : "chat-bubble-primary"
                    }`}
                  >
                    {chat.message}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      {chats.length > 0 && isTyping===receiverId && (
        <span className="loading loading-dots loading-lg m-5"></span>
      )}
    </div>
  );
};

export default ChatContainer;
