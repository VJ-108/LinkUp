import React from "react";
import { Link } from "react-router-dom";

const Help_center = () => {
  return (
    <div>
      Help_center
      <footer className="footer items-center p-4 bg-base-300 text-neutral-content absolute left-0">
        <aside className="items-center grid-flow-col p-2">
          <p className="text-sky-500 text-xl">Chat App</p>
          <p>Copyright © 2024 - All right reserved</p>
        </aside>
        <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end px-3">
          <Link to={"/"}>Home</Link>
          <Link to={"/about"}>About Us</Link>
          <Link to={"/help-center"}>Help Center</Link>
        </nav>
      </footer>
    </div>
  );
};

export default Help_center;
