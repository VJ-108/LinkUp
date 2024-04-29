import React, { useState, useEffect } from "react";
import axios from "axios";
import useOpenChat from "../hooks/useOpenChat";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentReceiver } from "../store/slices/userSlice";
import { setIsChatPanelVisible } from "../store/slices/chatSlice";

const SearchUser = ({ setChat }) => {
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const username = useSelector((store) => store.user.User.username);
  const dispatch = useDispatch();
  const { openChat } = useOpenChat();

  useEffect(() => {
    function handleClickOutside(event) {
      if (!event.target.closest(".dropdown-content")) {
        setFilteredUsers([]);
        setSearch("");
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

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
    <div className="relative grid grid-cols-6 gap-1 p-2">
      <input
        type="text"
        placeholder="Search"
        className="input input-bordered col-span-6"
        required
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
      />
      {filteredUsers.length !== 0 && (
        <div className="absolute top-full left-0 right-0 z-[9999] col-span-6 max-h-[29rem] overflow-y-auto mx-2 rounded-lg">
          <ul className="dropdown-content menu bg-base-100">
            {filteredUsers.map(
              (user) =>
                user.username !== username && (
                  <button
                    className="btn w-full block my-2"
                    key={user._id}
                    onClick={() => {
                      dispatch(setCurrentReceiver(user));
                      openChat("chat", user._id, setChat);
                      setFilteredUsers([]);
                      setSearch("");
                      if (window.innerWidth <= 768) {
                        dispatch(setIsChatPanelVisible(false));
                      }
                    }}
                  >
                    {user.username}
                  </button>
                )
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchUser;
