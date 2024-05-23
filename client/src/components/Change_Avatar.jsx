import React from "react";
import useChangeAvatar from "../hooks/useChangeAvatar";
import { AvatarList, lang } from "../utils/constants";
import { useSelector } from "react-redux";
const Change_Avatar = ({ setChangeAvatar }) => {
  const { change_avatar } = useChangeAvatar();
  const ln = useSelector((store) => store.user.ln);
  return (
    <>
      <div className="hero min-h-screen bg-transparent z-[100] absolute top-0">
        <div className="hero-content flex-col-reverse lg:flex-row-reverse h-[24rem] w-[24rem] md:w-[32rem] md:h-[30rem]">
          <div className="card shrink-0 w-full h-full shadow-2xl border border-gray-800 bg-base-300">
            <form className="card-body overflow-y-auto">
              <div className="text-center text-lg text-white">{lang[ln].avatar}</div>
              <div className="form-control cursor-pointer flex flex-row flex-wrap justify-center">
                {AvatarList.map((avatar, index) => {
                  return (
                    <img
                      key={index}
                      className="w-24 m-5"
                      alt="..."
                      src={`/${avatar}.png`}
                      onClick={() => {
                        change_avatar(avatar);
                        setChangeAvatar(false);
                      }}
                    />
                  );
                })}
              </div>
              <button
                className=" mt-16 w-full flex justify-center"
                onClick={() => setChangeAvatar(false)}
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
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Change_Avatar;
