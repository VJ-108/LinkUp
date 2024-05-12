import React, { useEffect, useState } from "react";
import useSendMessage from "../hooks/useSendMessage";
import SocketMessage from "../socket/SocketMessage";
import { useSelector } from "react-redux";
import { lang } from "../utils/constants";

const Message = ({ socket }) => {
  const [message, setMessage] = useState("");
  const ln = useSelector((store) => store.user.ln);
  const receiverId = useSelector((store) => store.user.currentReceiver._id);
  const groupId = useSelector((store) => store.user.currentGroup._id);
  const isChatPanelVisible = useSelector(
    (store) => store.chat.isChatPanelVisible
  );
  const { sendMessage } = useSendMessage();
  const { handleStartTyping, handleStopTyping } = SocketMessage(
    socket,
    groupId
  );
  const showParticipant = useSelector((store) => store.chat.showParticipant);
  useEffect(() => {
    handleStopTyping(message);
  }, [message, receiverId]);
  return showParticipant ? (
    <></>
  ) : (
    <div
      className={`md:col-span-2 col-span-3 grid grid-cols-12 p-1 gap-1 row-span-1 ${
        isChatPanelVisible ? "hidden md:grid" : ""
      }`}
    >
      <input
        type="text"
        placeholder={lang[ln].Type_here}
        className="input input-bordered input-info col-span-10 bg-transparent"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          handleStartTyping();
        }}
      />
      <button
        className="btn btn-outline bg-gray-950 hover:bg-gray-900 hover:text-white col-span-2"
        onClick={() => {
          sendMessage(message, receiverId, groupId);
          setMessage("");
        }}
      >
        {lang[ln].Send}
      </button>
    </div>
  );
};

export default Message;
