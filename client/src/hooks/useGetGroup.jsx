import axios from "axios";
import { useDispatch } from "react-redux";
import { setGroup } from "../store/slices/userSlice";
import { baseUrl } from "../utils/constants";

const useGetGroup = () => {
  const dispatch = useDispatch();
  const getGroup = (name) => {
    axios.defaults.withCredentials = true;
    axios
      .post(`${baseUrl}/api/v1/groups/get-group`, {
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
