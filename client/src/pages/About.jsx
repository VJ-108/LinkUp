import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { lang } from "../utils/constants";

const About = () => {
  const isloggedIn = useSelector((store) => store.user.isloggedIn);
  const ln = useSelector((store) => store.user.ln);
  return (
    <div className="bg-gradient-to-r from-black via-gray-900 to-black">
      <div className="pt-36 pb-10">
        <div className="text-center text-4xl font-bold text-white mb-3">
          {lang[ln].Key_Features}
        </div>
        <div className="flex flex-col lg:flex-row justify-center gap-10 p-10">
          {lang[ln].features.map((e) => {
            return (
              <div className="card lg:w-96 bg-base-300 shadow-xl cursor-pointer">
                <div className="card-body">
                  <div className="card-title flex justify-center text-white">
                    {e.feat}
                  </div>
                  <p
                    className="text-center text-base"
                    dangerouslySetInnerHTML={{ __html: e.desc }}
                  ></p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-5">
        <div className="text-center text-4xl font-bold text-white p-3">
          {lang[ln].How_It_Works}
        </div>
        <p className="text-center p-10">{lang[ln].How_It_Works_explained}</p>
      </div>

      <footer className="footer items-center p-4 bg-base-300 text-neutral-content absolute left-0">
        <aside className="items-center grid-flow-col p-2">
          <p className="text-sky-500 text-xl">{lang.en.Chat_App}</p>
          <p>{lang[ln].CopyRight}</p>
        </aside>
        <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end px-3">
          <Link to={"/"}>{lang[ln].Home}</Link>
          <Link to={"/about"}>{lang[ln].About_Us}</Link>
          {isloggedIn && (
            <Link to={"/help-center"}>{lang[ln].Help_Center}</Link>
          )}
        </nav>
      </footer>
    </div>
  );
};

export default About;
