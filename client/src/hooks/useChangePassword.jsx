import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/userSlice";
import axios from "axios";

const useChangePassword = () => {
  const dispatch = useDispatch();
  const change_password = (oldPassword, newPassword) => {
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:8000/api/v1/users/change-password", {
        oldPassword: oldPassword,
        newPassword: newPassword,
      })
      .then((response) => {
        dispatch(setUser(response.data.data?.user));
      })
      .catch((error) => {
        console.error("Error changing password:", error);
      });
  };
  return { change_password };
};

export default useChangePassword;
