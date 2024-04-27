import React, { useState } from "react";
import useSendMessage from "../hooks/useSendMessage";
import SocketMessage from "../socket/SocketMessage";
import { useSelector } from "react-redux";

const Message = ({ chat, setChat, socket }) => {
  const [message, setMessage] = useState("");
  const receiverId = useSelector((store) => store.user.currentReceiver._id);
  const groupId = useSelector((store) => store.user.currentGroup._id);
  const { sendMessage } = useSendMessage();
  const { joinGroup } = SocketMessage(socket, setChat, chat, groupId);
  return (
    <div>
      <input
        type="text"
        placeholder="Type here"
        className="input input-bordered input-info w-full max-w-xs"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        className="btn btn-outline btn-success"
        onClick={() => {
          sendMessage(message, receiverId, groupId);
        }}
      >
        Send
      </button>
    </div>
  );
};

export default Message;
