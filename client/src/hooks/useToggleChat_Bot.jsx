import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/userSlice";
import axios from "axios";
import { baseUrl } from "../utils/constants";

const useToggleChat_Bot = () => {
  const dispatch = useDispatch();
  const toggleChat_bot = () => {
    axios.defaults.withCredentials = true;
    axios
      .post(`${baseUrl}/api/v1/users/toggle-chat-bot`)
      .then((response) => {
        dispatch(setUser(response.data.data?.user));
      })
      .catch((error) => {
        console.error("Error toggling chat bot:", error);
      });
  };
  return { toggleChat_bot };
};

export default useToggleChat_Bot;
