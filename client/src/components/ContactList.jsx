import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useOpenChat from "../hooks/useOpenChat";
import { setCurrentGroup, setCurrentReceiver } from "../store/slices/userSlice";
import {
  setIsChatPanelVisible,
  setShowParticipant,
} from "../store/slices/chatSlice";
import useGetGroup from "../hooks/useGetGroup";

const ContactList = () => {
  const dispatch = useDispatch();
  const { openChat } = useOpenChat();
  const contact = useSelector((store) => store.user.contact);
  const username = useSelector((store) => store.user.User.username);
  const userId = useSelector((store) => store.user.User._id);
  const group = useSelector((store) => store.user.Group);
  const onlineUsers = useSelector((store) => store.socket.onlineUsers);
  const offlineMessages = useSelector((store) => store.chat.offlineMessages);
  const { getGroup } = useGetGroup();
  useEffect(() => {
    contact.forEach((chat) => {
      if (chat.groupId) {
        getGroup(chat.groupId.name);
      }
    });
  }, [contact]);

  const ifParticipant = (group) => {
    return group?.members?.some((member) => member._id === userId);
  };

  return (
    <div className="p-2 overflow-y-auto h-[75%]">
      {contact.map((chat) => (
        <div key={chat._id} className="my-2 p-2">
          {chat.groupId && ifParticipant(chat.groupId) ? (
            <button
              key={chat.groupId._id}
              className="btn w-full hover:outline grid grid-cols-12"
              onClick={() => {
                dispatch(setCurrentGroup(chat.groupId));
                dispatch(setCurrentReceiver({}));
                dispatch(setShowParticipant(false));
                openChat("group", chat.groupId._id);
                if (window.innerWidth <= 768) {
                  dispatch(setIsChatPanelVisible(false));
                }
              }}
            >
              <div className="col-span-1"></div>
              <div className="col-span-10">{chat.groupId.name}</div>
              <div className={`h-4 w-4 col-span-1`}>
                {offlineMessages[chat.groupId._id]}
              </div>
            </button>
          ) : (
            !chat.groupId && (
              <>
                {chat.participants.map((participant) => {
                  if (participant.username !== username) {
                    const isOnline = Object.keys(onlineUsers).some(
                      (userId) => participant._id === userId
                    );
                    return (
                      <button
                        key={participant._id}
                        className="btn w-full hover:outline grid grid-cols-12"
                        onClick={() => {
                          dispatch(setCurrentReceiver(participant));
                          dispatch(setCurrentGroup({}));
                          dispatch(setShowParticipant(false));
                          openChat("chat", participant._id);
                          if (window.innerWidth <= 768) {
                            dispatch(setIsChatPanelVisible(false));
                          }
                        }}
                      >
                        <div
                          className={`h-4 w-4 rounded-full bg-green-600 col-span-1 ${
                            isOnline ? "" : "invisible"
                          }`}
                        ></div>
                        <div className="col-span-10">
                          {participant.username}
                        </div>
                        <div className={`h-4 w-4 col-span-1`}>
                          {offlineMessages[participant._id] !== 0
                            ? offlineMessages[participant._id]
                            : ""}
                        </div>
                      </button>
                    );
                  } else {
                    return null;
                  }
                })}
              </>
            )
          )}
        </div>
      ))}
    </div>
  );
};

export default ContactList;
