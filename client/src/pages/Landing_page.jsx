import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Landing_page = () => {
  const isloggedIn = useSelector((store) => store.user.isloggedIn);
  return (
    <div className="bg-gradient-to-r from-black via-gray-900 to-black">
      <div className="m-2">
        <div className="h-screen grid grid-cols-2">
          <div className="md:col-span-1 col-span-2 w-full grid md:py-48 py-36 gap-10">
            <div className="text-white font-extrabold text-4xl font-sans text-wrap flex justify-center items-center text-center">
              Experience seamless communication like never before with Chat App.
            </div>
            <div className="text-gray-500 text-lg text-wrap flex justify-center text-center p-0">
              <div>
                Say goodbye to{" "}
                <span className="text-sky-500">endless email threads</span> and
                disjointed conversations. Say hello to{" "}
                <span className="text-sky-500">effortless collaboration </span>
                and meaningful connections.
              </div>
            </div>
            <div className="flex justify-center">
              <Link
                to={"/signup"}
                className="btn btn-info text-white text-base w-[8rem]"
              >
                Get Started
              </Link>
            </div>
          </div>
          <div className="col-span-1 hidden md:flex items-center justify-center">
            <img src="/chat.png" alt="..." className="h-[80%] " />
          </div>
        </div>
        <footer className="footer items-center p-4 bg-base-300 text-neutral-content absolute left-0">
          <aside className="items-center grid-flow-col p-2">
            <p className="text-sky-500 text-xl">Chat App</p>
            <p>Copyright © 2024 - All right reserved</p>
          </aside>
          <nav className="grid-flow-col md:place-self-center md:justify-self-end gap-4 px-3">
            <Link to={"/"}>Home</Link>
            <Link to={"/about"}>About Us</Link>
            {isloggedIn && <Link to={"/help-center"}>Help Center</Link>}
          </nav>
        </footer>
      </div>
    </div>
  );
};

export default Landing_page;
