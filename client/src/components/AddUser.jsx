import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useToggleMember from "../hooks/useToggleMember";
import { baseUrl, lang } from "../utils/constants";

const AddUser = ({ setChangeAddUser }) => {
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const Group = useSelector((store) => store.user.Group);
  const ln = useSelector((store) => store.user.ln);
  const { toggleMember } = useToggleMember();
  useEffect(() => {
    function handleClickOutside(event) {
      if (!event.target.closest(".dropdown-content")) {
        setFilteredUsers([]);
        setSearch("");
      }
    }
    document.addEventListener("click", handleClickOutside);
    console.log(lang[ln]);
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
      .post(`${baseUrl}/api/v1/users/search-user`, {
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
    <div className="hero min-h-screen bg-transparent z-[100] absolute top-0">
      <div className="hero-content flex-col-reverse lg:flex-row-reverse w-[18rem] md:w-[28rem] h-[28rem]">
        <div className="card shrink-0 w-full h-full shadow-2xl border border-gray-800 bg-base-300">
          <div className="card-body">
            <input
              type="text"
              placeholder={lang[ln].search}
              className="input input-bordered col-span-6 "
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
              <div className="overflow-y-auto mx-2 rounded-lg max-h-[17rem]">
                <ul className="dropdown-content menu bg-black">
                  {filteredUsers.map((user) => {
                    const isAlreadyMember = Group?.members?.some(
                      (member) => member._id === user._id
                    );
                    return (
                      !isAlreadyMember && (
                        <button
                          className="btn w-full block my-2 hover:outline"
                          key={user._id}
                          onClick={() => {
                            setFilteredUsers([]);
                            setSearch("");
                            toggleMember(user._id);
                            setChangeAddUser(false);
                          }}
                        >
                          {user.username}
                        </button>
                      )
                    );
                  })}
                </ul>
              </div>
            )}
            <button
              className="absolute top-[90%] left-0 w-full flex justify-center"
              onClick={() => setChangeAddUser(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
