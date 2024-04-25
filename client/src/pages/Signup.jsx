import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useSignup from "../hooks/useSignup";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isregistered, signup } = useSignup();
  const navigate = useNavigate();
  if (isregistered) {
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

      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col-reverse lg:flex-row-reverse">
          <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <form className="card-body">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Username</span>
                </label>
                <input
                  type="username"
                  placeholder="username"
                  className="input input-bordered"
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
                  className="input input-bordered"
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
                  className="input input-bordered"
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
                  className="btn btn-primary"
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
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
              excepturi
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
