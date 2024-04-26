import { useEffect } from "react";

const SocketMessage = (socket, setChat, chat, groupId) => {
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      console.log("New message received:", newMessage);
      setChat((prevChat) => [...prevChat, newMessage]);
    };

    const handleGroupMessage = (groupMessage) => {
      if (groupMessage.groupId === groupId) {
        console.log("Group message received:", groupMessage);
        setChat((prevChat) => [...prevChat, groupMessage.message]);
      }
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("groupMessage", handleGroupMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("groupMessage", handleGroupMessage);
    };
  }, [socket, setChat, chat, groupId]);

  const joinGroup = () => {
    if (socket) {
      socket.emit("joinGroup", groupId);
    }
  };

  return { joinGroup };
};

export default SocketMessage;
