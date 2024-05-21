import axios from "axios";
import { useDispatch } from "react-redux";
import { setFilteredUsers } from "../store/slices/chatSlice";
import { baseUrl } from "../utils/constants";

const useSearchUser = () => {
  const dispatch = useDispatch();
  const searchUser = (search) => {
    if (search === "") {
      dispatch(setFilteredUsers([]));
      return;
    }
    axios.defaults.withCredentials = true;
    axios
      .post(`${baseUrl}/api/v1/users/search-user`, {
        username: search,
      })
      .then((response) => {
        dispatch(setFilteredUsers(response.data.data));
      })
      .catch((error) => {
        console.error("Error searching users:", error);
      });
  };
  return { searchUser };
};

export default useSearchUser;
