import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { logout } = useLogout();
  const navigate = useNavigate();
  const isloggedIn = useSelector((store) => store.user.isloggedIn);
  const avatar = useSelector((store) => store.user.User.avatar)
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
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link to={"/"}>Home</Link>
            </li>
            {isloggedIn && (
              <li>
                <Link to={"/chat"}>Chat</Link>
              </li>
            )}
            <li>
              <Link to={"/about"}>About Us</Link>
            </li>
            {isloggedIn && (
              <li>
                <Link to={"/help-center"}>Help Center</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="navbar-center">
        <Link to={"/"} className="btn btn-ghost text-xl">
          Chat App
        </Link>
      </div>
      <div className="navbar-end">
        <div className="flex-none gap-2">
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
                    Profile
                  </Link>
                </li>
                <li>
                  <a onClick={() => logout()}>Logout</a>
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
              LogIn
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
