import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/userSlice";
import axios from "axios";

const useChangeAvatar = () => {
  const dispatch = useDispatch();
  const change_avatar = (avatar) => {
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:8000/api/v1/users/change-avatar", {
        avatar: avatar,
      })
      .then((response) => {
        dispatch(setUser(response.data.data?.user));
      })
      .catch((error) => {
        console.error("Error changing avatar:", error);
      });
  };
  return { change_avatar };
};

export default useChangeAvatar;
