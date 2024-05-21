import axios from "axios";
import { useDispatch } from "react-redux";
import { registered } from "../store/slices/userSlice";
import { baseUrl } from "../utils/constants";

const useSignup = () => {
  const dispatch = useDispatch();
  const signup = (username, email, password) => {
    axios.defaults.withCredentials = true;
    axios
      .post(`${baseUrl}/api/v1/users/register`, {
        username: username,
        email: email,
        password: password,
      })
      .then((response) => {
        dispatch(registered(true));
      })
      .catch((error) => {
        console.error("Error signing up:", error);
        dispatch(registered(false));
      });
  };
  return { signup };
};

export default useSignup;
