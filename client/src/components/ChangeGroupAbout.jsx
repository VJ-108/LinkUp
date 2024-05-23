import React, { useState } from "react";
import useChangeGroupDesc from "../hooks/useChangeGroupDesc";
import { lang } from "../utils/constants";
import { useSelector } from "react-redux";

const ChangeGroupAbout = ({ setChangeGroupDesc }) => {
  const [groupAbout, setGroupAbout] = useState("");
  const ln = useSelector((store) => store.user.ln);
  const { changeGroupDesc } = useChangeGroupDesc();
  return (
    <div className="hero min-h-screen bg-transparent z-[100] absolute top-0">
      <div className="hero-content flex-col-reverse lg:flex-row-reverse w-[19rem] md:w-[28rem] h-[14rem]">
        <div className="card shrink-0 w-full h-full shadow-2xl border border-gray-800 bg-base-300">
          <div className="card-body">
            <h1>{lang[ln].Change_Group_About_msg}</h1>
            <input
              type="text"
              placeholder={lang[ln].Change_Group_About}
              className="input input-bordered col-span-6 "
              required
              value={groupAbout}
              onChange={(e) => setGroupAbout(e.target.value)}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  if (groupAbout && groupAbout.length < 60) {
                    changeGroupDesc(groupAbout);
                    setGroupAbout("");
                    setChangeGroupDesc(false);
                  }
                }
              }}
            />
            <button
              className="absolute top-[80%] left-0 w-full flex justify-center"
              onClick={() => {
                setChangeGroupDesc(false);
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

export default ChangeGroupAbout;
