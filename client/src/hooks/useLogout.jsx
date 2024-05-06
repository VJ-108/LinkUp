import axios from "axios";
import { useDispatch } from "react-redux";
import { loggedIn, setUser } from "../store/slices/userSlice";
import SocketCreate from "../socket/SocketCreate";
const useLogout = () => {
  const dispatch = useDispatch();
  const { handleLogout } = SocketCreate();
  const logout = () => {
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:8000/api/v1/users/logout")
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
