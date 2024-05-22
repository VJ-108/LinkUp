import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useSendHelp from "../hooks/useSendHelp";
import { useSelector } from "react-redux";
import { lang } from "../utils/constants";

const Help_center = () => {
  const { sendHelp } = useSendHelp();
  const [message, setMessage] = useState("");
  const ln = useSelector((store) => store.user.ln);
  const isloggedIn = useSelector((store) => store.user.isloggedIn);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isloggedIn) {
      navigate("/login");
    }
  }, []);
  return (
    <div className="bg-gradient-to-r from-black via-gray-900 to-black">
      <div className="h-screen flex justify-center items-center flex-col">
        <div className="text-4xl text-white font-bold pt-3">
          {lang[ln].Help_Center}
        </div>
        <div className="gap-5 flex items-center flex-col p-5 lg:w-[50%] w-[80%] h-[50%]">
          <div className="text-lg text-center pb-5">
            {lang[ln].Help_Center_msg}
          </div>
          <input
            className="input input-bordered w-full"
            placeholder={lang[ln].Help_Center_input}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></input>
          <button
            className="btn bg-gray-950 hover:bg-gray-800 w-full"
            onClick={() => {
              sendHelp(message);
              setMessage("");
            }}
          >
            {lang[ln].Help_Center_input_button}
          </button>
        </div>
      </div>
      <footer className="footer items-center p-4 bg-base-300 text-neutral-content absolute left-0">
        <aside className="items-center grid-flow-col p-2">
          <p className="text-sky-500 text-xl">{lang.en.Chat_App}</p>
          <p>{lang[ln].CopyRight}</p>
        </aside>
        <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end px-3">
          <Link to={"/"}>{lang[ln].Home}</Link>
          <Link to={"/about"}>{lang[ln].About_Us}</Link>
          <Link to={"/help-center"}>{lang[ln].Help_Center}</Link>
        </nav>
      </footer>
    </div>
  );
};

export default Help_center;
