import React, { useState } from "react";
import axios from "axios";
import useOpenChat from "../hooks/useOpenChat";
import { useDispatch } from "react-redux";
import { setCurrentReceiver } from "../store/slices/userSlice";

const SearchUser = ({ setChat }) => {
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const dispatch = useDispatch();
  const { openChat } = useOpenChat();
  const handleSearch = () => {
    if (search === "") {
      setFilteredUsers([]);
      return;
    }
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:8000/api/v1/users/search-user", {
        username: search,
      })
      .then((response) => {
        setFilteredUsers(response.data.data);
      })
      .catch((error) => {
        console.error("Error searching users:", error);
      });
  };
  return (
    <div className=" grid grid-cols-12 w-full p-1 gap-1">
      <input
        type="text"
        placeholder="search"
        className="input input-bordered col-span-10"
        required
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button className="btn col-span-2" onClick={handleSearch}>
        Search
      </button>
      <ul>
        {filteredUsers.map((user) => (
          <button
            className="btn"
            key={user._id}
            onClick={() => {
              dispatch(setCurrentReceiver(user));
              openChat("chat", user._id, setChat);
            }}
          >
            {user.username}
          </button>
        ))}
      </ul>
    </div>
  );
};

export default SearchUser;
