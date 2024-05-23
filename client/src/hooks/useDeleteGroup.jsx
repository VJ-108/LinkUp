import axios from "axios";
import { baseUrl } from "../utils/constants";
import { useDispatch } from "react-redux";
import { setCurrentGroup, setCurrentReceiver } from "../store/slices/userSlice";
import {
  setShowParticipant,
  toggleChatPanelVisibility,
} from "../store/slices/chatSlice";

const useDeleteGroup = () => {
  const dispatch = useDispatch();
  const deleteGroup = (name) => {
    axios.defaults.withCredentials = true;
    axios
      .post(`${baseUrl}/api/v1/groups/delete-group`, {
        name: name,
      })
      .then((response) => {
        dispatch(setCurrentGroup({}));
        dispatch(setCurrentReceiver({}));
        dispatch(toggleChatPanelVisibility());
        dispatch(setShowParticipant(false));
      })
      .catch((error) => {
        console.error("Error deleting group:", error);
      });
  };
  return { deleteGroup };
};

export default useDeleteGroup;
