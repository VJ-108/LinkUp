import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/userSlice";
import axios from "axios";
import { baseUrl } from "../utils/constants";

const useChangeAbout = () => {
  const dispatch = useDispatch();
  const change_about = (about) => {
    axios.defaults.withCredentials = true;
    axios
      .post(`${baseUrl}/api/v1/users/change-about`, {
        about: about,
      })
      .then((response) => {
        dispatch(setUser(response.data.data?.user));
      })
      .catch((error) => {
        console.error("Error changing about:", error);
      });
  };
  return { change_about };
};

export default useChangeAbout;
