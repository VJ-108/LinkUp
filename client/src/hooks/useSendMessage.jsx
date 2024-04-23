import axios from "axios";

const useSendMessage = () => {
  const sendMessage = (message, receiverId, groupId) => {
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:8000/api/v1/messages/send-message", {
        message: message,
        receiverId: receiverId,
        groupId: groupId,
      })
      .then(() => {
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  };
  return { sendMessage };
};

export default useSendMessage;
