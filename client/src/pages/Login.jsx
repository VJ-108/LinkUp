import { useState } from "react";
import Message from "../components/message";
import useLogin from "../hooks/useLogin";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { onlineUsers, socket, login } = useLogin();
  return (
    <>
      <div className="text-5xl">App</div>
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={() => {
        login(email,password)
      }}>Login</button>

      <div>
        <h2>Active Users:</h2>
        <ul>
          {Object.keys(onlineUsers).map((userId) => (
            <li key={userId}>
              userId: {userId}, SocketId: {onlineUsers[userId]}
            </li>
          ))}
        </ul>
        <Message socket={socket} />
      </div>
    </>
  );
};

export default Login;
