import { useState } from "react";
import axios from "axios";
const useLogin = () => {
  const [userId, setUserId] = useState("");
  const login = (email, password) => {
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:8000/api/v1/users/login", {
        email: email,
        password: password,
      })
      .then((response) => {
        setUserId(response.data.data?.user?._id);
      })
      .catch((error) => {
        console.error("Error logging in:", error);
      });
  };
  return { userId, login };
};

export default useLogin;
