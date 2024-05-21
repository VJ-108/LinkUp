import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/userSlice";
import axios from "axios";
import { baseUrl } from "../utils/constants";

const useChangeAvatar = () => {
  const dispatch = useDispatch();
  const change_avatar = (avatar) => {
    axios.defaults.withCredentials = true;
    axios
      .post(`${baseUrl}/api/v1/users/change-avatar`, {
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
