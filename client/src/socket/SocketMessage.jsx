import { useEffect } from "react";

const SocketMessage = (socket, setChat, chat, groupId) => {
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
  return { joinGroup };
};

export default SocketMessage;
