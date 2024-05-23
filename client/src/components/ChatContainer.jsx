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
  const chatContainerRef = useRef(null);
  const chats = useSelector((store) => store.chat.chats);
  const avatar = useSelector((store) => store.user.User.avatar);
  const userId = useSelector((store) => store.user.User._id);
  const receiver = useSelector((store) => store.user.currentReceiver.username);
  const receiverId = useSelector((store) => store.user.currentReceiver._id);
  const receiver_about = useSelector(
    (store) => store.user.currentReceiver.about
  );
  const group = useSelector((store) => store.user.currentGroup.name);
  const group_members = useSelector((store) => store.user.currentGroup.members);
  const showParticipant = useSelector((store) => store.chat.showParticipant);
  const onlineUsers = useSelector((store) => store.socket.onlineUsers);
  const isTyping = useSelector((store) => store.chat.isTyping);
  const offlineMessages = useSelector((store) => store.chat.offlineMessages);
  const receiver_avatar = useSelector(
    (store) => store.user.currentReceiver.avatar
  );
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
          {receiver_avatar ? (
            <div
              className={`h-10 w-10 rounded-full ${
                isOnline ? "border-4 border-green-600" : ""
              } ${receiver ? "block" : "hidden"}`}
            >
              <img
                className="w-full"
                alt="..."
                src={`/${receiver_avatar}.png`}
              />
            </div>
          ) : (
            group_members && (
              <div className="avatar-group -space-x-6 rtl:space-x-reverse">
                {group_members.length > 3
                  ? group_members.slice(0, 3).map((member, index) => {
                      return (
                        <div className="avatar" key={index}>
                          <div className="w-10">
                            <img
                              className="w-full"
                              alt="..."
                              src={`/${member.avatar}.png`}
                            />
                          </div>
                        </div>
                      );
                    })
                  : group_members.map((member, index) => {
                      return (
                        <div className="avatar" key={index}>
                          <div className="w-10">
                            <img
                              className="w-full"
                              alt=""
                              src={`/${member.avatar}.png`}
                            />
                          </div>
                        </div>
                      );
                    })}
              </div>
            )
          )}
          <a
            className="btn btn-ghost text-xl mx-3"
            onClick={() =>
              group
                ? dispatch(setShowParticipant(true))
                : dispatch(setShowParticipant(false))
            }
          >
            {receiver ? receiver : group}
          </a>
        </div>
        {receiver_about?.length > 0 && receiver && (
          <div className="navbar-end float-right w-full px-4 text-cyan-400">
            " {receiver_about} "
          </div>
        )}
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
                  {group
                    ? group_members.map((member) => {
                        if (
                          member._id === chat.senderId &&
                          member._id !== userId
                        ) {
                          return (
                            <div
                              key={member._id}
                              className="h-full flex items-end flex-col justify-center"
                            >
                              <div className="text-white w-full text-center">
                                {member.username}
                              </div>
                              <img
                                className="w-8"
                                alt="..."
                                src={`/${member.avatar}.png`}
                              />
                            </div>
                          );
                        }
                        return null;
                      })
                    : chat.senderId !== userId && (
                        <div className="h-full flex items-end">
                          <img
                            className="w-8 "
                            alt="..."
                            src={`/${receiver_avatar}.png`}
                          />
                        </div>
                      )}
                  <div
                    className={`chat-bubble md:p-5 font-medium text-sm ${
                      chat.senderId === userId
                        ? "chat-bubble-success"
                        : "chat-bubble-primary"
                    }`}
                  >
                    {chat.message}
                  </div>
                  {chat.senderId === userId && (
                    <img
                      className="w-8 float-right"
                      alt="..."
                      src={`/${avatar}.png`}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      {chats.length > 0 && isTyping === receiverId && (
        <span className="loading loading-dots loading-lg m-5"></span>
      )}
    </div>
  );
};

export default ChatContainer;
