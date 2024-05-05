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
  const { getGroup } = useGetGroup();
  useEffect(() => {
    contact.forEach((chat) => {
      if (chat.groupId) {
        getGroup(chat.groupId.name);
      }
    });
  }, [contact, getGroup]);

  const ifParticipant = () => {
    return group?.members?.some((member) => member._id === userId);
  };

  return (
    <div className="p-2 overflow-y-auto max-h-[78%] md:max-h-[82%]">
      {contact.map((chat) => (
        <div key={chat._id} className="my-2 p-2">
          {chat.groupId && ifParticipant() ? (
            <button
              key={chat.groupId._id}
              className="btn w-full hover:outline"
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
              {chat.groupId.name}
            </button>
          ) : null}
          {!chat.groupId && (
            <>
              {chat.participants.map((participant) => {
                if (participant.username !== username) {
                  return (
                    <button
                      key={participant._id}
                      className="btn w-full hover:outline"
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
                      {participant.username}
                    </button>
                  );
                } else {
                  return null;
                }
              })}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default ContactList;
