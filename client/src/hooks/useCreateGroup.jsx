import { useDispatch } from "react-redux";
import { setCurrentGroup, setCurrentReceiver } from "../store/slices/userSlice";
import useOpenChat from "./useOpenChat";
import axios from "axios";
import { baseUrl } from "../utils/constants";
import { toggleChatPanelVisibility } from "../store/slices/chatSlice";

const useCreateGroup = () => {
  const dispatch = useDispatch();
  const { openChat } = useOpenChat();
  const createGroup = (name) => {
    axios.defaults.withCredentials = true;
    axios
      .post(`${baseUrl}/api/v1/groups/create-group`, {
        name: name,
      })
      .then((response) => {
        if (response.data?.data?._id) {
          dispatch(setCurrentGroup(response.data?.data));
          dispatch(setCurrentReceiver({}));
          openChat("group", response.data?.data._id);
          dispatch(toggleChatPanelVisibility(false));
        } else {
          alert("Group name already exists. Please choose another name.");
        }
      })
      .catch((error) => {
        console.error("Error creating group:", error);
        dispatch(setCurrentGroup({}));
        dispatch(setCurrentReceiver({}));
      });
  };
  return { createGroup };
};

export default useCreateGroup;
