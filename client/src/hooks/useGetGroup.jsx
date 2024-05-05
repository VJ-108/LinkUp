import axios from "axios";
import { useDispatch } from "react-redux";
import { setGroup } from "../store/slices/userSlice";

const useGetGroup = () => {
  const dispatch = useDispatch();
  const getGroup = (name) => {
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:8000/api/v1/groups/get-group", {
        name: name,
      })
      .then((response) => {
        dispatch(setGroup(response.data?.data));
      })
      .catch((error) => {
        console.error("Error logging out:", error);
        dispatch(setGroup({}));
      });
  };
  return { getGroup };
};

export default useGetGroup;
