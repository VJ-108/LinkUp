import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { lang } from "../utils/constants";

const Landing_page = () => {
  const isloggedIn = useSelector((store) => store.user.isloggedIn);
  const ln = useSelector((store) => store.user.ln);
  return (
    <div className="bg-gradient-to-r from-black via-gray-900 to-black">
      <div className="m-2">
        <div className="h-screen grid grid-cols-2">
          <div className="md:col-span-1 col-span-2 w-full grid md:py-48 py-36 gap-10">
            <div className="text-white font-extrabold text-4xl font-sans text-wrap flex justify-center items-center text-center">
              {lang[ln].Home_title_1}
            </div>
            <div className="text-gray-500 text-lg text-wrap flex justify-center text-center p-0">
              <div
                dangerouslySetInnerHTML={{ __html: lang[ln].Home_title_2 }}
              ></div>
            </div>
            <div className="flex justify-center">
              <Link
                to={"/signup"}
                className="btn btn-info text-white text-base w-[8rem]"
              >
                {lang[ln].Home_button}
              </Link>
            </div>
          </div>
          <div className="col-span-1 hidden md:flex items-center justify-center">
            <img src="/chat.png" alt="..." className="h-[80%] " />
          </div>
        </div>
        <footer className="footer items-center p-4 bg-base-300 text-neutral-content absolute left-0">
          <aside className="items-center grid-flow-col p-2">
            <p className="text-sky-500 text-xl">{lang.en.Chat_App}</p>
            <p>{lang[ln].CopyRight}</p>
          </aside>
          <nav className="grid-flow-col md:place-self-center md:justify-self-end gap-4 px-3">
            <Link to={"/"}>{lang[ln].Home}</Link>
            <Link to={"/about"}>{lang[ln].About_Us}</Link>
            {isloggedIn && (
              <Link to={"/help-center"}>{lang[ln].Help_Center}</Link>
            )}
          </nav>
        </footer>
      </div>
    </div>
  );
};

export default Landing_page;
