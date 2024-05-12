import { useEffect, useState } from "react";
import useLogin from "../hooks/useLogin";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { lang } from "../utils/constants";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loginWithToken } = useLogin();
  const isloggedin = useSelector((store) => store.user.isloggedIn);
  const ln = useSelector((store) => store.user.ln);
  const navigate = useNavigate();
  useEffect(() => {
    loginWithToken();
    if (isloggedin) {
      navigate("/chat");
    }
  }, []);
  useEffect(() => {
    if (isloggedin) {
      navigate("/chat");
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
                  <span className="label-text">{lang[ln].Email}</span>
                </label>
                <input
                  type="email"
                  placeholder={lang[ln].Email}
                  className="input input-bordered bg-transparent"
                  required
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
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
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
                <label className="label">
                  <Link
                    to={"/signup"}
                    className="label-text-alt link link-hover"
                  >
                    {lang[ln].Login_msg}
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
                  {lang[ln].LogIn}
                </button>
              </div>
            </form>
          </div>
          <div className="text-center lg:text-left mt-28 md:mt-0">
            <h1 className="text-5xl font-bold">{lang[ln].Login_title_1}</h1>
            <p className="py-6">{lang[ln].Login_title_2}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
