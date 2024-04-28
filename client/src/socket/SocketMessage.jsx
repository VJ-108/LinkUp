import { useEffect } from "react";
import { useSelector } from "react-redux";

const SocketMessage = (socket, setChat, chat, groupId) => {
  const currentUser = useSelector((store) => store.user.User);
  const currentReceiverId = useSelector(
    (store) => store.user.currentReceiver._id
  );
  const currentGroupId = useSelector((store) => store.user.currentGroup._id);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      console.log("New message received:", newMessage);
      if (
        (newMessage.senderId === currentUser._id &&
          newMessage.receiverId === currentReceiverId) ||
        (newMessage.senderId === currentReceiverId &&
          newMessage.receiverId === currentUser._id)
      ) {
        setChat((prevChat) => [...prevChat, newMessage]);
        console.log(chat);
      }
    };

    const handleGroupMessage = (groupMessage) => {
      console.log("Group message received:", groupMessage);
      if (
        groupMessage.groupId === groupId &&
        groupMessage.groupId === currentGroupId
      ) {
        setChat((prevChat) => [...prevChat, groupMessage.message]);
      }
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("groupMessage", handleGroupMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("groupMessage", handleGroupMessage);
    };
  }, [
    socket,
    setChat,
    groupId,
    currentUser,
    currentReceiverId,
    currentGroupId,
  ]);

  const joinGroup = () => {
    if (socket) {
      socket.emit("joinGroup", groupId);
    }
  };

  return { joinGroup };
};

export default SocketMessage;
