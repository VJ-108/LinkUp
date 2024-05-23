import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import { useDispatch, useSelector } from "react-redux";
import { setLanguage } from "../store/slices/userSlice";
import { lang } from "../utils/constants";

const Navbar = () => {
  const { logout } = useLogout();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isloggedIn = useSelector((store) => store.user.isloggedIn);
  const avatar = useSelector((store) => store.user.User.avatar);
  const ln = useSelector((store) => store.user.ln);
  useEffect(() => {
    if (!isloggedIn) {
      navigate("/");
    }
  }, [isloggedIn]);
  return (
    <div className="navbar bg-base-300 bg-opacity-95 absolute top-0 z-[100]">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-48"
          >
            <li>
              <Link to={"/"}>{lang[ln].Home}</Link>
            </li>
            {isloggedIn && (
              <li>
                <Link to={"/chat"}>{lang[ln].Chat}</Link>
              </li>
            )}
            <li>
              <Link to={"/about"}>{lang[ln].About_Us}</Link>
            </li>
            {isloggedIn && (
              <li>
                <Link to={"/help-center"}>{lang[ln].Help_Center}</Link>
              </li>
            )}
            <li>
              <div className="dropdown dropdown-right">
                <div tabIndex={0}>
                  {lang[ln].Change_Language}
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-24"
                >
                  <li onClick={() => dispatch(setLanguage("en"))}>
                    <a>English</a>
                  </li>
                  <li onClick={() => dispatch(setLanguage("hindi"))}>
                    <a>Hindi</a>
                  </li>
                  <li onClick={() => dispatch(setLanguage("pjb"))}>
                    <a>Punjabi</a>
                  </li>
                  <li onClick={() => dispatch(setLanguage("marathi"))}>
                    <a>Marathi</a>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className="navbar-center">
        <Link to={"/"} className="btn btn-ghost text-xl">
          {lang.en.Chat_App}
        </Link>
      </div>
      <div className="navbar-end">
        <div className="flex gap-2">
          {isloggedIn ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10">
                  <img alt="..." src={`/${avatar}.png`} />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
              >
                <li>
                  <Link to={"/profile"} className="justify-between">
                    {lang[ln].Profile}
                  </Link>
                </li>
                <li>
                  <a onClick={() => logout()}>{lang[ln].Logout}</a>
                </li>
              </ul>
            </div>
          ) : (
            <button
              className="btn bg-sky-500 text-white hover:bg-sky-600"
              onClick={() => {
                navigate("/login");
              }}
            >
              {lang[ln].LogIn}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
