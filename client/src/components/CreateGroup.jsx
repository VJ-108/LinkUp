import React, { useState } from "react";
import useCreateGroup from "../hooks/useCreateGroup";
import { useSelector } from "react-redux";
import { lang } from "../utils/constants";

const CreateGroup = ({ setCreateGroup }) => {
  const [groupName, setGroupName] = useState("");
  const ln = useSelector((store) => store.user.ln);
  const { createGroup } = useCreateGroup();
  return (
    <div className="hero min-h-screen bg-transparent z-[100] absolute top-0">
      <div className="hero-content flex-col-reverse lg:flex-row-reverse w-[20rem] md:w-[28rem] md:h-[12rem]">
        <div className="card shrink-0 w-full h-full shadow-2xl border border-gray-800 bg-base-300">
          <div className="card-body">
            <h1>{lang[ln].ChangeProfile_msg}</h1>
            <input
              type="text"
              placeholder={lang[ln].Group_Name}
              className="input input-bordered col-span-6 "
              required
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  if (groupName && groupName.length < 30) {
                    createGroup(groupName);
                    setCreateGroup(false);
                  }
                }
              }}
            />
            <button
              className="absolute top-[80%] left-0 w-full flex justify-center"
              onClick={() => {
                setCreateGroup(false);
              }}
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

export default CreateGroup;
