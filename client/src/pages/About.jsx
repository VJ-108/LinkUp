import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const About = () => {
  const isloggedIn = useSelector((store) => store.user.isloggedIn);
  const features = [
    {
      feat: "Intuitive Interface",
      desc: "<span class='text-sky-500'>User-friendly</span> interface designed to be <span class='text-sky-500'>easy to use</span> and navigate.",
    },
    {
      feat: "Instant Messaging",
      desc: "<span class='text-sky-500'>Real-time</span> messaging functionality for <span class='text-sky-500'>quick</span> communication.",
    },
    {
      feat: "Security Features",
      desc: "Robust <span class='text-sky-500'>security measures</span> to protect user data and ensure <span class='text-sky-500'>privacy</span>.",
    },
    {
      feat: "Customizable Settings",
      desc: "Ability to <span class='text-sky-500'>personalize settings</span> according to <span class='text-sky-500'>individual preferences</span> and needs.",
    },
  ];

  return (
    <div className="bg-gradient-to-r from-black via-gray-900 to-black">
      <div className="pt-36 pb-10">
        <div className="text-center text-4xl font-bold text-white mb-3">
          Key Features
        </div>
        <div className="flex flex-col lg:flex-row justify-center gap-10 p-10">
          {features.map((e) => {
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
          How It Works
        </div>
        <p className="text-center p-10">
          Getting started with Chat App is easy.Simply sign up, and start
          chatting! Invite your team members, friends, or family to join Chat
          App and start collaborating instantly.
        </p>
      </div>

      <footer className="footer items-center p-4 bg-base-300 text-neutral-content absolute left-0">
        <aside className="items-center grid-flow-col p-2">
          <p className="text-sky-500 text-xl">Chat App</p>
          <p>Copyright © 2024 - All right reserved</p>
        </aside>
        <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end px-3">
          <Link to={"/"}>Home</Link>
          <Link to={"/about"}>About Us</Link>
          {isloggedIn && <Link to={"/help-center"}>Help Center</Link>}
        </nav>
      </footer>
    </div>
  );
};

export default About;
