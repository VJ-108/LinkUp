import { useDispatch, useSelector } from "react-redux";
import { setGroup } from "../store/slices/userSlice";
import axios from "axios";

const useToggleAdmin = () => {
  const dispatch = useDispatch();
  const group = useSelector((store) => store.user.currentGroup.name);
  const toggleAdmin = (userId) => {
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:8000/api/v1/groups/toggle-admin", {
        userId: userId,
        group: group,
      })
      .then((response) => {
        dispatch(setGroup(response.data?.data));
      })
      .catch((error) => {
        console.error("Error logging out:", error);
        dispatch(setGroup({}));
      });
  };
  return { toggleAdmin };
};

export default useToggleAdmin;
