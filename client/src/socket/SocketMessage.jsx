import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addChat } from "../store/slices/chatSlice";

const SocketMessage = (socket, groupId) => {
  const currentUser = useSelector((store) => store.user.User);
  const dispatch = useDispatch();
  const currentReceiverId = useSelector(
    (store) => store.user.currentReceiver._id
  );
  const currentGroupId = useSelector((store) => store.user.currentGroup._id);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      if (
        (newMessage.senderId === currentUser._id &&
          newMessage.receiverId === currentReceiverId) ||
        (newMessage.senderId === currentReceiverId &&
          newMessage.receiverId === currentUser._id)
      ) {
        dispatch(addChat(newMessage));
      }
    };

    const handleGroupMessage = (groupMessage) => {
      if (
        groupMessage.groupId === groupId &&
        groupMessage.groupId === currentGroupId
      ) {
        dispatch(addChat(groupMessage.message));
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
