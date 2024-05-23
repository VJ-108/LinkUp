import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useChangeAbout from "../hooks/useChangeAbout";
import useChangePassword from "../hooks/useChangePassword";
import useChangeUsername from "../hooks/useChangeUsername";
import { lang } from "../utils/constants";

const ChangeProfile = ({ setChangeProfile }) => {
  const change_type = useSelector((store) => store.user.change_profile);
  const ln = useSelector((store) => store.user.ln);
  const [oldChange, setOldChange] = useState("");
  const [newChange, setNewChange] = useState("");
  const [displayChange, setDisplayChange] = useState("");
  const [errors, setErrors] = useState({});
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
  }, [change_type, ln]);

  const validate = () => {
    const newErrors = {};
    if (change_type === "Username") {
      if (!newChange) newErrors.newChange = lang[ln].username_required;
      else if (newChange.length > 8)
        newErrors.newChange = lang[ln].username_too_long;
    } else if (change_type === "Password") {
      if (!oldChange) newErrors.oldChange = lang[ln].old_password_required;
      if (!newChange) newErrors.newChange = lang[ln].password_required;
      else if (newChange.length < 10)
        newErrors.newChange = lang[ln].password_too_short;
      else if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/.test(
          newChange
        )
      )
        newErrors.newChange = lang[ln].password_invalid;
    } else if (change_type === "About") {
      if (!newChange) newErrors.newChange = lang[ln].about_required;
      else if (newChange.length > 30)
        newErrors.newChange = lang[ln].about_too_long;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      if (change_type === "Username") {
        change_username(newChange);
      } else if (change_type === "Password") {
        change_password(oldChange, newChange);
      } else if (change_type === "About") {
        change_about(newChange);
      }
      setChangeProfile(false);
    }
  };

  return (
    <>
      <div className="hero min-h-screen bg-transparent z-[100] absolute top-0">
        <div className="hero-content flex-col-reverse lg:flex-row-reverse w-[22rem] md:w-[28rem] max-h-[28rem]">
          <div className="card shrink-0 w-full h-full shadow-2xl border border-gray-800 bg-base-300">
            <form className="card-body" onSubmit={handleSubmit}>
              {change_type === "Password" && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">{`${lang[ln].old} ${displayChange}`}</span>
                  </label>
                  <input
                    type="password"
                    className="input input-bordered bg-base-300"
                    value={oldChange}
                    onChange={(e) => setOldChange(e.target.value)}
                    required
                  />
                  {errors.oldChange && (
                    <span className="text-red-500">{errors.oldChange}</span>
                  )}
                </div>
              )}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">{`${lang[ln].new} ${displayChange}`}</span>
                </label>
                <input
                  type={change_type === "Password" ? "password" : "text"}
                  className="input input-bordered bg-base-300"
                  value={newChange}
                  onChange={(e) => setNewChange(e.target.value)}
                  required
                />
                {errors.newChange && (
                  <span className="text-red-500">{errors.newChange}</span>
                )}
              </div>
              <div className="form-control mt-6">
                <button
                  type="submit"
                  className="btn bg-gray-950 hover:bg-gray-800"
                >
                  {lang[ln].change}
                </button>
              </div>
              <button
                className="mt-14 w-full flex justify-center"
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
