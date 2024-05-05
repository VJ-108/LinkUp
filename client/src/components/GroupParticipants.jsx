import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setShowParticipant } from "../store/slices/chatSlice";
import useGetGroup from "../hooks/useGetGroup";
import useToggleAdmin from "../hooks/useToggleAdmin";
import useToggleMember from "../hooks/useToggleMember";
import useLeaveGroup from "../hooks/useLeaveGroup";
import useGetUserChats from "../hooks/useGetUserChats";

const GroupParticipants = () => {
  const dispatch = useDispatch();
  const group = useSelector((store) => store.user.currentGroup.name);
  const showParticipant = useSelector((store) => store.chat.showParticipant);
  const Group = useSelector((store) => store.user.Group);
  const userId = useSelector((store) => store.user.User._id);
  const [isAdmin, setisAdmin] = useState(false);
  const { getGroup } = useGetGroup();
  const { toggleMember } = useToggleMember();
  const { toggleAdmin } = useToggleAdmin();
  const { leaveGroup } = useLeaveGroup();
  const { userChats } = useGetUserChats();

  useEffect(() => {
    getGroup(group);
  }, []);
  useEffect(() => {
    getGroup(group);
    Group?.admin?.map((admin) => {
      if (admin._id === userId) {
        setisAdmin(true);
      }
    });
  }, [Group]);
  return (
    showParticipant && (
      <div
        className={`border border-gray-800 overflow-y-auto relative m-2 rounded-lg row-span-11 md:col-span-2 col-span-3 ${
          showParticipant ? "block" : "hidden"
        }`}
      >
        <div className="navbar sticky top-0 left-0 bg-base-100 h-10 z-50 text-white">
          <div className="navbar-center">
            <a
              className="btn btn-ghost text-xl"
              onClick={() => dispatch(setShowParticipant(false))}
            >
              {group}
            </a>
          </div>
        </div>
        <div>
          <h1 className="px-4 pt-3 text-2xl font-semibold">Admin</h1>
          <div className="p-3">
            {Group?.admin?.map((admin) => {
              return (
                <div
                  className="navbar bg-base-100 my-3 rounded-lg"
                  key={admin._id}
                >
                  <div className="flex-1">
                    <a className="btn btn-ghost text-xl">{admin.username}</a>
                  </div>
                  {isAdmin && admin._id !== userId && (
                    <div className="flex-none">
                      <div className="dropdown dropdown-end">
                        <button className="btn btn-square btn-ghost">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            className="inline-block w-5 h-5 stroke-current"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                            ></path>
                          </svg>
                        </button>
                        <ul
                          tabIndex={0}
                          className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
                        >
                          <li>
                            <a
                              className="justify-between"
                              onClick={() => toggleAdmin(admin._id)}
                            >
                              Dismiss as Admin
                            </a>
                          </li>
                          <li>
                            <a onClick={() => toggleMember(admin._id)}>
                              Remove User
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <h1 className="px-4 pt-3 text-2xl font-semibold">Members</h1>
          <div className="p-3">
            {Group?.members?.map((member) => {
              return (
                <div
                  className="navbar bg-base-100 my-3 rounded-lg"
                  key={member._id}
                >
                  <div className="flex-1">
                    <a className="btn btn-ghost text-xl">{member.username}</a>
                  </div>
                  {isAdmin && member._id !== userId && (
                    <div className="flex-none">
                      <div className="dropdown dropdown-end">
                        <button className="btn btn-square btn-ghost">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            className="inline-block w-5 h-5 stroke-current"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                            ></path>
                          </svg>
                        </button>
                        <ul
                          tabIndex={0}
                          className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
                        >
                          <li>
                            <a
                              className="justify-between"
                              onClick={() => toggleAdmin(member._id)}
                            >
                              Make Admin
                            </a>
                          </li>
                          <li>
                            <a onClick={() => toggleMember(member._id)}>
                              Remove User
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        {isAdmin && (
          <button className="btn bg-blue-700 text-white hover:bg-blue-600 m-3">
            Add User
          </button>
        )}
        <button
          className="btn bg-red-700 text-white hover:bg-red-600 m-3"
          onClick={() => {
            leaveGroup();
            userChats();
            dispatch(setShowParticipant(false));
          }}
        >
          Leave Group
        </button>
      </div>
    )
  );
};

export default GroupParticipants;
