import axios from "axios";
import { setContact } from "../store/slices/userSlice";
import { useDispatch } from "react-redux";

const useGetUserChats = () => {
  const dispatch = useDispatch();
  const userChats = () => {
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:8000/api/v1/messages/get-user-chats")
      .then((response) => {
        dispatch(setContact(response.data.data));
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });
  };
  return { userChats };
};

export default useGetUserChats;
