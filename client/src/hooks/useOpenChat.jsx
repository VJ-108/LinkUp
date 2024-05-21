import axios from "axios";
import { useDispatch } from "react-redux";
import { setChat } from "../store/slices/chatSlice";
import { baseUrl } from "../utils/constants";

const useOpenChat = () => {
  const dispatch = useDispatch();
  const openChat = (type, id) => {
    dispatch(setChat([]));
    axios.defaults.withCredentials = true;
    let receiverId, groupId;
    if (type === "group") groupId = id;
    else receiverId = id;
    axios
      .post(`${baseUrl}/api/v1/messages/get-message`, {
        receiverId: receiverId,
        groupId: groupId,
      })
      .then((response) => {
        dispatch(setChat(response.data.data));
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });
  };
  return { openChat };
};

export default useOpenChat;
