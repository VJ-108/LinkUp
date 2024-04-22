import React, { useState, useEffect } from "react";
import axios from "axios";

const Message = ({ socket }) => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [receiverId, setReceiverId] = useState("");
  const [groupId, setGroupId] = useState("");
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
  }, [socket, chat,groupId]);

  const sendMessage = () => {
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:8000/api/v1/messages/send-message", {
        message: message,
        receiverId: receiverId,
        groupId: groupId,
      })
      .then(() => {
        setMessage("");
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  };

  const fetchMessages = () => {
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:8000/api/v1/messages/get-message", {
        receiverId: receiverId,
        groupId: groupId,
      })
      .then((response) => {
        const messages = response.data.data;
        setChat(messages);
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });
  };

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
      <button onClick={sendMessage}>Send</button>
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
