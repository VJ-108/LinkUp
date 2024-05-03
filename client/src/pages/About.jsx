import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div>
      <section className="features">
        <h2>Key Features</h2>
        <ul>
          <li>Intuitive Interface</li>
          <li>Instant Messaging</li>
          <li>Seamless Integration</li>
          <li>Customizable Settings</li>
        </ul>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <p>
          Getting started with [App Name] is easy. Simply sign up, create your
          profile, and start chatting! Invite your team members, friends, or
          family to join [App Name] and start collaborating instantly.
        </p>
      </section>

      <section className="testimonials">
        <h2>Testimonials</h2>
        <div className="testimonial">
          <p>
            '[App Name] has completely transformed the way we communicate within
            our team. It's intuitive, efficient, and fun to use!' - John D.
          </p>
        </div>
        <div className="testimonial">
          <p>
            'I love how I can seamlessly switch between devices without missing
            a beat. [App Name] keeps me connected wherever I go.' - Sarah L.
          </p>
        </div>
        <div className="testimonial">
          <p>
            'Thanks to [App Name], coordinating family events has never been
            easier. It's become an essential tool for staying connected with my
            loved ones.' - Michael R.
          </p>
        </div>
      </section>
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

export default About;
