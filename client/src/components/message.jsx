import React, { useState, useEffect } from "react";
import useSendMessage from "../hooks/useSendMessage";
import useFetchMessage from "../hooks/useFetchMessage";

const Message = ({ socket }) => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [receiverId, setReceiverId] = useState("");
  const [groupId, setGroupId] = useState("");
  const { sendMessage } = useSendMessage();
  const { fetchMessages } = useFetchMessage();
  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      setChat([...chat, newMessage]);
    });
    socket.on("groupMessage", (groupMessage) => {
      if (groupMessage.groupId === groupId) {
        setChat([...chat, groupMessage.message]);
      }
    });
    return () => {
      socket.off("newMessage");
      socket.off("groupMessage");
    };
  }, [socket, chat, groupId]);

  const joinGroup = () => {
    socket.emit("joinGroup", groupId);
  };
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
