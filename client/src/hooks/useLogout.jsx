import axios from "axios";
import { useDispatch } from "react-redux";
import { loggedIn, setUser } from "../store/slices/userSlice";
import SocketCreate from "../socket/SocketCreate";
import { baseUrl } from "../utils/constants";
const useLogout = () => {
  const dispatch = useDispatch();
  const { handleLogout } = SocketCreate();
  const logout = () => {
    axios.defaults.withCredentials = true;
    axios
      .post(`${baseUrl}/api/v1/users/logout`)
      .then((response) => {
        dispatch(setUser({}));
        dispatch(loggedIn(false));
        handleLogout();
      })
      .catch((error) => {
        console.error("Error logging out:", error);
        dispatch(loggedIn(false));
      });
  };
  return { logout };
};

export default useLogout;
