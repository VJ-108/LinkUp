import React, { useState } from "react";
import useSendMessage from "../hooks/useSendMessage";
import SocketMessage from "../socket/SocketMessage";

const Message = ({ chat, setChat, socket }) => {
  const [message, setMessage] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [groupId, setGroupId] = useState("");
  const { sendMessage } = useSendMessage();
  const { joinGroup } = SocketMessage(socket, setChat, chat, groupId);
  return (
    <div>
      <input
        type="text"
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <input
        type="text"
        placeholder="ReceiverId"
        value={receiverId}
        onChange={(e) => setReceiverId(e.target.value)}
      />
      <input
        type="text"
        placeholder="GroupId"
        value={groupId}
        onChange={(e) => setGroupId(e.target.value)}
      />
      <button
        onClick={() => {
          sendMessage(message, receiverId, groupId);
        }}
      >
        Send
      </button>
      <button onClick={joinGroup}>Join Group</button>
    </div>
  );
};

export default Message;
