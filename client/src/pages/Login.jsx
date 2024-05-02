import { useEffect, useState } from "react";
import useLogin from "../hooks/useLogin";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loginWithToken } = useLogin();
  const isloggedin = useSelector((store) => store.user.isloggedIn);
  const navigate = useNavigate();
  useEffect(() => {
    loginWithToken();
    if (isloggedin) {
      navigate("/home");
    }
  }, []);
  useEffect(() => {
    if (isloggedin) {
      navigate("/home");
    }
  }, [isloggedin]);
  return (
    <>
      <div className="hero min-h-screen bg-gradient-to-r from-black via-gray-900 to-black">
        <div className="hero-content flex-col-reverse lg:flex-row-reverse">
          <div className="card shrink-0 w-full max-w-sm shadow-2xl border border-gray-800">
            <form className="card-body">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="email"
                  className="input input-bordered bg-transparent"
                  required
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
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
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
                <label className="label">
                  <Link
                    to={"/signup"}
                    className="label-text-alt link link-hover"
                  >
                    Don't have an account?
                  </Link>
                </label>
              </div>
              <div className="form-control mt-6">
                <button
                  className="btn bg-gray-950 hover:bg-gray-800"
                  onClick={(e) => {
                    e.preventDefault();
                    login(email, password);
                  }}
                >
                  Login
                </button>
              </div>
            </form>
          </div>
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">Login now!</h1>
            <p className="py-6">
              Start chatting! Login to connect with others and explore new
              conversations.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
