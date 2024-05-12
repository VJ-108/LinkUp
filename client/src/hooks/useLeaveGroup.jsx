import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setGroup } from "../store/slices/userSlice";

const useLeaveGroup = () => {
  const dispatch = useDispatch();
  const group = useSelector((store) => store.user.currentGroup.name);
  const leaveGroup = () => {
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:8000/api/v1/groups/leave-group", {
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
  return { leaveGroup };
};

export default useLeaveGroup;
