import axios from "axios";
import { useDispatch } from "react-redux";
import { loggedIn, setUser } from "../store/slices/userSlice";
import { baseUrl } from "../utils/constants";
const useLogin = () => {
  const dispatch = useDispatch();
  const login = (email, password) => {
    axios.defaults.withCredentials = true;
    axios
      .post(`${baseUrl}/api/v1/users/login`, {
        email: email,
        password: password,
      })
      .then((response) => {
        dispatch(setUser(response.data.data?.user));
        dispatch(loggedIn(true));
      })
      .catch((error) => {
        console.error("Error logging in:", error);
        dispatch(loggedIn(false));
      });
  };
  const loginWithToken = () => {
    axios.defaults.withCredentials = true;
    axios
      .post(`${baseUrl}/api/v1/users/login`)
      .then((response) => {
        dispatch(setUser(response.data.data?.user));
        dispatch(loggedIn(true));
      })
      .catch((error) => {
        console.error("Error logging in with token:", error);
        dispatch(loggedIn(false));
      });
  };
  return { login, loginWithToken };
};

export default useLogin;
