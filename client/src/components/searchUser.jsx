import React, { useState, useEffect } from "react";
import useOpenChat from "../hooks/useOpenChat";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentReceiver } from "../store/slices/userSlice";
import {
  setFilteredUsers,
  setIsChatPanelVisible,
  setShowParticipant,
} from "../store/slices/chatSlice";
import useSearchUser from "../hooks/useSearchUser";
import { lang } from "../utils/constants";

const SearchUser = () => {
  const [search, setSearch] = useState("");
  const ln = useSelector((store) => store.user.ln);
  const filteredUsers = useSelector((store) => store.chat.filteredUsers);
  const username = useSelector((store) => store.user.User.username);
  const dispatch = useDispatch();
  const { openChat } = useOpenChat();
  const { searchUser } = useSearchUser();

  useEffect(() => {
    function handleClickOutside(event) {
      if (!event.target.closest(".dropdown-content")) {
        dispatch(setFilteredUsers([]));
        setSearch("");
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative grid grid-cols-6 gap-1 p-2">
      <input
        type="text"
        placeholder={lang[ln].search}
        className="input input-bordered col-span-6 "
        required
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            searchUser(search);
          }
        }}
      />
      {filteredUsers.length !== 0 && (
        <div className="absolute top-full left-0 right-0 z-[9999] col-span-6 overflow-y-auto mx-2 rounded-lg max-h-[29rem] ">
          <ul className="dropdown-content menu bg-black">
            {filteredUsers.map(
              (user) =>
                user.username !== username && (
                  <button
                    className="btn w-full block my-2 hover:outline"
                    key={user._id}
                    onClick={() => {
                      dispatch(setCurrentReceiver(user));
                      dispatch(setShowParticipant(false));
                      dispatch(setFilteredUsers([]));
                      openChat("chat", user._id);
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
