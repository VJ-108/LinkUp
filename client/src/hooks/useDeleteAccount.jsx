import React from "react";
import { useDispatch } from "react-redux";
import { loggedIn, setUser } from "../store/slices/userSlice";
import axios from "axios";

const useDeleteAccount = () => {
  const dispatch = useDispatch();
  const delete_account = () => {
    axios.defaults.withCredentials = true;
    axios
      .delete("http://localhost:8000/api/v1/users/delete-account")
      .then((response) => {
        dispatch(setUser({}));
        dispatch(loggedIn(false));
      })
      .catch((error) => {
        console.error("Error deleting account: ", error);
      });
  };
  return { delete_account };
};

export default useDeleteAccount;
