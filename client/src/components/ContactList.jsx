import React from "react";
import { useDispatch, useSelector } from "react-redux";
import useOpenChat from "../hooks/useOpenChat";
import { setCurrentGroup, setCurrentReceiver } from "../store/slices/userSlice";
import { setIsChatPanelVisible } from "../store/slices/chatSlice";

const ContactList = () => {
  const dispatch = useDispatch();
  const { openChat } = useOpenChat();
  const contact = useSelector((store) => store.user.contact);
  const username = useSelector((store) => store.user.User.username);
  return (
    <div className="p-2 overflow-y-auto max-h-[78%] md:max-h-[82%]">
      {contact.map((chat) => (
        <div key={chat._id} className="my-2 p-2">
          {chat.groupId ? (
            <button
              key={chat.groupId._id}
              className="btn w-full bg-gradient-to-r from-slate-900 to-gray-950 hover:outline"
              onClick={() => {
                dispatch(setCurrentGroup(chat.groupId._id));
                openChat("group", chat.groupId._id);
                if (window.innerWidth <= 768) {
                  dispatch(setIsChatPanelVisible(false));
                }
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
                      className="btn w-full hover:outline"
                      onClick={() => {
                        dispatch(setCurrentReceiver(participant));
                        openChat("chat", participant._id);
                        if (window.innerWidth <= 768) {
                          dispatch(setIsChatPanelVisible(false));
                        }
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
  );
};

export default ContactList;
