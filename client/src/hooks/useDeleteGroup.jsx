import axios from "axios";
import { baseUrl } from "../utils/constants";

const useDeleteGroup = () => {
  const deleteGroup = (name) => {
    axios.defaults.withCredentials = true;
    axios
      .post(`${baseUrl}/api/v1/groups/delete-group`, {
        name: name,
      })
      .then((response) => {})
      .catch((error) => {
        console.error("Error deleting group:", error);
      });
  };
  return { deleteGroup };
};

export default useDeleteGroup;
