import axios from "axios";
import { useDispatch } from "react-redux";
import { loggedIn, setUser } from "../store/slices/userSlice";
const useLogout = () => {
    const dispatch = useDispatch();
  const logout = () => {
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:8000/api/v1/users/logout")
      .then((response) => {
        dispatch(setUser({}));
        dispatch(loggedIn(false));
      })
      .catch((error) => {
        console.error("Error logging out:", error);
        dispatch(loggedIn(false));
      });
  };
  return { logout };
};

export default useLogout;
