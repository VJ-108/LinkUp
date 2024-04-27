import React, { useState } from "react";
import axios from "axios";
import useOpenChat from "../hooks/useOpenChat";

const SearchUser = ({ setChat }) => {
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
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
    <div>
      <input
        type="text"
        placeholder="search"
        className="input input-bordered"
        required
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button className="btn" onClick={handleSearch}>
        Search
      </button>
      <ul>
        {filteredUsers.map((user) => (
          <button
            className="btn"
            key={user._id}
            onClick={() => {
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
