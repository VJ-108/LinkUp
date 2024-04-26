import React, { useState } from "react";
import axios from "axios";

const SearchUser = () => {
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  const handleSearch = () => {
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
          <li key={user._id}>{user.username}</li>
        ))}
      </ul>
    </div>
  );
};

export default SearchUser;
