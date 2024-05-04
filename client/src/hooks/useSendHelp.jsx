import axios from "axios";
import { useSelector } from "react-redux";

const useSendHelp = () => {
  const name = useSelector((store) => store.user.User.username);
  const email = useSelector((store) => store.user.User.email);
  const sendHelp = (message) => {
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:8000/api/v1/helps/send-help", {
        name: name,
        email: email,
        message: message,
      })
      .then((response) => {})
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });
  };
  return { sendHelp };
};

export default useSendHelp;
