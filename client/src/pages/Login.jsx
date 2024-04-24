import { useState } from "react";
import Message from "../components/message";
import useLogin from "../hooks/useLogin";
import SocketCreate from "../socket/SocketCreate";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { userId, login } = useLogin();
  const { onlineUsers, socket } = SocketCreate(userId);
  return (
    <>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            {/* <div>
              <h2>Active Users:</h2>
              <ul>
                {Object.keys(onlineUsers).map((userId) => (
                  <li key={userId}>
                    userId: {userId}, SocketId: {onlineUsers[userId]}
                  </li>
                ))}
              </ul>
              <Message socket={socket} />
            </div> */}
            <form className="card-body">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="email"
                  className="input input-bordered"
                  required
                  onChange={(e) => {
                    setEmail(e.target.value);
                    console.log(email);
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
                  className="input input-bordered"
                  required
                  onChange={(e) => {
                    setPassword(e.target.value);
                    console.log(password);
                  }}
                />
                <label className="label">
                  <a href="#" className="label-text-alt link link-hover">
                    Forgot password?
                  </a>
                </label>
              </div>
              <div className="form-control mt-6">
                <button
                  className="btn btn-primary"
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
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
              excepturi
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
