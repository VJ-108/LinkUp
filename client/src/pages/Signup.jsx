import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useSignup from "../hooks/useSignup";
import { useSelector } from "react-redux";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup } = useSignup();
  const navigate = useNavigate();
  const isRegistered = useSelector((store) => store.user.isRegistered);
  if (isRegistered) {
    document.getElementById("my_modal").showModal();
  }
  return (
    <>
      <dialog id="my_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Registration Successful!</h3>
          <p className="py-4">
            Congratulations on successfully joining our chat community! Your
            journey starts here. Hit the button below to log in and start
            chatting away!
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn" onClick={() => navigate("/login")}>
                Login
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
                  <span className="label-text">Username</span>
                </label>
                <input
                  type="username"
                  placeholder="username"
                  className="input input-bordered bg-transparent"
                  required
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="email"
                  className="input input-bordered bg-transparent"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="password"
                  className="input input-bordered bg-transparent"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label className="label">
                  <Link
                    to={"/login"}
                    className="label-text-alt link link-hover"
                  >
                    Already have an account?
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
                  Signup
                </button>
              </div>
            </form>
          </div>
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">Signup now!</h1>
            <p className="py-6">
              Sign up now to join our friendly community! Connect with others
              and start chatting instantly.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
