import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addChat,
  setIsTyping,
  setOfflineMessages,
} from "../store/slices/chatSlice";

const SocketMessage = (socket, groupId) => {
  const currentUser = useSelector((store) => store.user.User);
  const dispatch = useDispatch();
  const currentReceiverId = useSelector(
    (store) => store.user.currentReceiver._id
  );
  const currentGroupId = useSelector((store) => store.user.currentGroup._id);
  const offlineMessages = useSelector((store) => store.chat.offlineMessages);
  const handleStartTyping = () => {
    socket.emit("typing", currentReceiverId);
  };
  const handleStopTyping = (message) => {
    if (message === "") {
      if (socket) {
        socket.emit("stop typing", currentReceiverId);
      }
    }
  };
  useEffect(() => {
    const storedMessages = localStorage.getItem("offlineMessages");
    if (storedMessages) {
      dispatch(setOfflineMessages(JSON.parse(storedMessages)));
    }
  }, []);
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
      } else {
        const key =
          newMessage.senderId === currentUser._id
            ? newMessage.receiverId
            : newMessage.senderId;
        const unreadCount = (offlineMessages[key] || 0) + 1;
        const updatedOfflineMessages = {
          ...offlineMessages,
          [key]: unreadCount,
        };
        dispatch(setOfflineMessages(updatedOfflineMessages));
        localStorage.setItem(
          "offlineMessages",
          JSON.stringify(updatedOfflineMessages)
        );
      }
    };

    const handleGroupMessage = (groupMessage) => {
      if (groupMessage.groupId === currentGroupId) {
        dispatch(addChat(groupMessage.message));
      } else {
        const key = groupMessage.groupId;
        const unreadCount = (offlineMessages[key] || 0) + 1;
        const updatedOfflineMessages = {
          ...offlineMessages,
          [key]: unreadCount,
        };
        dispatch(setOfflineMessages(updatedOfflineMessages));
        localStorage.setItem(
          "offlineMessages",
          JSON.stringify(updatedOfflineMessages)
        );
      }
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("groupMessage", handleGroupMessage);

    socket.on("typing", () => dispatch(setIsTyping(currentReceiverId)));
    socket.on("stop typing", () => dispatch(setIsTyping("")));
    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("groupMessage", handleGroupMessage);
    };
  }, [
    socket,
    currentUser,
    currentReceiverId,
    currentGroupId,
    dispatch,
    offlineMessages,
  ]);

  const joinGroup = () => {
    if (socket) {
      socket.emit("joinGroup", groupId);
    }
  };

  return { joinGroup, handleStartTyping, handleStopTyping };
};

export default SocketMessage;
