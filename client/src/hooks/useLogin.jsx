import axios from "axios";
import { useDispatch } from "react-redux";
import { loggedIn, setUser } from "../store/slices/userSlice";
const useLogin = () => {
  const dispatch = useDispatch();
  const login = (email, password) => {
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:8000/api/v1/users/login", {
        email: email,
        password: password,
      })
      .then((response) => {
        dispatch(setUser(response.data.data?.user));
        dispatch(loggedIn(true));
      })
      .catch((error) => {
        console.error("Error logging in:", error);
        dispatch(loggedIn(false))
      });
  };
  return { login };
};

export default useLogin;
