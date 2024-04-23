import axios from "axios";

const useFetchMessage = () => {
    const fetchMessages = (receiverId,groupId,setChat) => {
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
  return {fetchMessages}
}

export default useFetchMessage