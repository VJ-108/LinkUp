import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentGroup, setCurrentReceiver } from "../store/slices/userSlice";
import { baseUrl } from "../utils/constants";

const useChangeGroupDesc = () => {
  const group = useSelector((store) => store.user.currentGroup.name);
  const dispatch = useDispatch();
  const changeGroupDesc = (about) => {
    axios.defaults.withCredentials = true;
    axios
      .post(`${baseUrl}/api/v1/groups/change-about`, {
        about: about,
        group: group,
      })
      .then((response) => {
        dispatch(setCurrentGroup(response.data?.data));
        dispatch(setCurrentReceiver({}));
      })
      .catch((error) => {
        console.error("Error changing group about:", error);
        dispatch(setCurrentGroup({}));
        dispatch(setCurrentReceiver({}));
      });
  };
  return { changeGroupDesc };
};

export default useChangeGroupDesc;
