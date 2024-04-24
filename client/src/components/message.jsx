import React, { useState } from "react";
import useSendMessage from "../hooks/useSendMessage";
import useFetchMessage from "../hooks/useFetchMessage";
import SocketMessage from "../socket/SocketMessage";

const Message = ({ socket }) => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [receiverId, setReceiverId] = useState("");
  const [groupId, setGroupId] = useState("");
  const { sendMessage } = useSendMessage();
  const { fetchMessages } = useFetchMessage();
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
      <button
        onClick={() => {
          fetchMessages(receiverId, groupId, setChat);
        }}
      >
        Fetch
      </button>
      <button onClick={joinGroup}>Join Group</button>
      <div>
        {chat.map((message) => (
          <div key={message._id}>{message.message}</div>
        ))}
      </div>
    </div>
  );
};

export default Message;
