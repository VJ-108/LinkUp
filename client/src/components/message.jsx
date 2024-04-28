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
    <div className="md:col-span-2 col-span-3 grid grid-cols-12 p-1 gap-1 row-span-1">
      <input
        type="text"
        placeholder="Type here"
        className="input input-bordered input-info col-span-10"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        className="btn btn-outline btn-success col-span-2"
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
