import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useSignup from "../hooks/useSignup";
import { useSelector } from "react-redux";
import { lang } from "../utils/constants";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup } = useSignup();
  const navigate = useNavigate();
  const isRegistered = useSelector((store) => store.user.isRegistered);
  const ln = useSelector((store) => store.user.ln);
  if (isRegistered) {
    document.getElementById("my_modal").showModal();
  }
  return (
    <>
      <dialog id="my_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">{lang[ln].Signup_dialog_title}</h3>
          <p className="py-4">{lang[ln].Signup_dialog_msg}</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn" onClick={() => navigate("/login")}>
                {lang[ln].LogIn}
              </button>
            </form>
          </div>
        </div>
      </dialog>

      <div className="hero min-h-screen bg-gradient-to-r from-black via-gray-900 to-black">
        <div className="hero-content flex-col-reverse lg:flex-row-reverse">
          <div className="card shrink-0 w-full max-w-sm shadow-2xl border border-gray-800">
            <form className="card-body">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">{lang[ln].username}</span>
                </label>
                <input
                  type="username"
                  placeholder={lang[ln].username}
                  className="input input-bordered bg-transparent"
                  required
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">{lang[ln].Email}</span>
                </label>
                <input
                  type="email"
                  placeholder={lang[ln].Email}
                  className="input input-bordered bg-transparent"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">{lang[ln].Password}</span>
                </label>
                <input
                  type="password"
                  placeholder={lang[ln].Password}
                  className="input input-bordered bg-transparent"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label className="label">
                  <Link
                    to={"/login"}
                    className="label-text-alt link link-hover"
                  >
                    {lang[ln].Signup_msg}
                  </Link>
                </label>
              </div>
              <div className="form-control mt-6">
                <button
                  className="btn bg-gray-950 hover:bg-gray-800"
                  onClick={(e) => {
                    e.preventDefault();
                    signup(username, email, password);
                  }}
                >
                  {lang[ln].Signup}
                </button>
              </div>
            </form>
          </div>
          <div className="text-center lg:text-left mt-28 md:mt-0">
            <h1 className="text-5xl font-bold">{lang[ln].Signup_title_1}</h1>
            <p className="py-6">{lang[ln].Signup_title_2}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
