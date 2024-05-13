import axios from "axios";

const useDeleteGroup = () => {
  const deleteGroup = (name) => {
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:8000/api/v1/groups/delete-group", {
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
