import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/userSlice";
import axios from "axios";

const useChangeUsername = () => {
  const dispatch = useDispatch();
  const change_username = (username) => {
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:8000/api/v1/users/change-username", {
        username: username,
      })
      .then((response) => {
        dispatch(setUser(response.data.data?.user));
      })
      .catch((error) => {
        console.error("Error changing username:", error);
      });
  };
  return { change_username };
};

export default useChangeUsername;
