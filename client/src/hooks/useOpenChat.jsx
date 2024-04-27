import axios from "axios";

const useOpenChat = () => {
  const openChat = (type, id, setChat) => {
    setChat([]);
    axios.defaults.withCredentials = true;
    let receiverId, groupId;
    if (type === "group") groupId = id;
    else receiverId = id;
    axios
      .post("http://localhost:8000/api/v1/messages/get-message", {
        receiverId: receiverId,
        groupId: groupId,
      })
      .then((response) => {
        setChat(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });
  };
  return { openChat };
};

export default useOpenChat;
