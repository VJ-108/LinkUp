import axios from "axios";
import { useState } from "react";

const useSignup = () => {
  const [isregistered, setIsRegistered] = useState("");
  const signup = (username, email, password) => {
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:8000/api/v1/users/register", {
        username: username,
        email: email,
        password: password,
      })
      .then((response) => {
        setIsRegistered(response.data.data?._id);
      })
      .catch((error) => {
        console.error("Error logging in:", error);
      });
  };
  return { isregistered, signup };
};

export default useSignup;
