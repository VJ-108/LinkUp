import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useChangeAbout from "../hooks/useChangeAbout";
import useChangePassword from "../hooks/useChangePassword";
import useChangeUsername from "../hooks/useChangeUsername";
import { lang } from "../utils/constants";

const ChangeProfile = ({ setChangeProfile }) => {
  const change_type = useSelector((store) => store.user.change_profile);
  const ln = useSelector((store) => store.user.ln);
  const [oldChange, setOldChange] = useState();
  const [newChange, setNewChange] = useState();
  const [displayChange, setDisplayChange] = useState();
  const { change_about } = useChangeAbout();
  const { change_password } = useChangePassword();
  const { change_username } = useChangeUsername();
  useEffect(() => {
    if (change_type === "Username") {
      setDisplayChange(lang[ln].username);
    } else if (change_type === "Password") {
      setDisplayChange(lang[ln].password);
    } else if (change_type === "About") {
      setDisplayChange(lang[ln].about);
    }
  }, []);
  const changeProfile = () => {
    if (change_type === "Username") {
      setDisplayChange(lang[ln].username);
      change_username(newChange);
    } else if (change_type === "Password") {
      setDisplayChange(lang[ln].password);
      change_password(oldChange, newChange);
    } else if (change_type === "About") {
      setDisplayChange(lang[ln].about);
      change_about(newChange);
    }
    setChangeProfile(false);
  };
  return (
    <>
      <div className="hero min-h-screen bg-transparent z-[100] absolute top-0">
        <div className="hero-content flex-col-reverse lg:flex-row-reverse w-[28rem] h-[28rem]">
          <div className="card shrink-0 w-full h-full shadow-2xl border border-gray-800 bg-base-300">
            <form className="card-body">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">{`${lang[ln].old}  ${displayChange}`}</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered bg-base-300"
                  required
                  onChange={(e) => setOldChange(e.target.value)}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">{`${lang[ln].new}  ${displayChange}`}</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered bg-base-300"
                  required
                  onChange={(e) => setNewChange(e.target.value)}
                />
              </div>
              <div className="form-control mt-6">
                <button
                  className="btn bg-gray-950 hover:bg-gray-800"
                  onClick={(e) => {
                    e.preventDefault();
                    changeProfile();
                  }}
                >
                  {lang[ln].change}
                </button>
              </div>
              <button
                className=" mt-16 w-full flex justify-center"
                onClick={() => setChangeProfile(false)}
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

export default ChangeProfile;
