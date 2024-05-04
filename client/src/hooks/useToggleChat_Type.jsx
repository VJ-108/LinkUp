import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/userSlice";
import axios from "axios";

const useToggleChat_Type = () => {
  const dispatch = useDispatch();
  const toggleChat_type = () => {
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:8000/api/v1/users/toggle-chat-type")
      .then((response) => {
        dispatch(setUser(response.data.data?.user));
      })
      .catch((error) => {
        console.error("Error toggling chat type:", error);
      });
  };
  return { toggleChat_type };
};

export default useToggleChat_Type;
