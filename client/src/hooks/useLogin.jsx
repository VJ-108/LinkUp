import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loggedIn } from "../store/slices/userSlice";
const useLogin = () => {
  const [userId, setUserId] = useState("");
  const dispatch = useDispatch();

  const login = (email, password) => {
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:8000/api/v1/users/login", {
        email: email,
        password: password,
      })
      .then((response) => {
        setUserId(response.data.data?.user?._id);
        dispatch(loggedIn(true));
      })
      .catch((error) => {
        console.error("Error logging in:", error);
        dispatch(loggedIn(false))
      });
  };
  return { userId, login };
};

export default useLogin;
