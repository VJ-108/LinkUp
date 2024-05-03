import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat_page from "./pages/Chat_page";
import Landing_page from "./pages/Landing_page";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Help_center from "./pages/Help_center";

const App = () => {
  return (
    <>
      <Provider store={store}>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing_page />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/chat" element={<Chat_page />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/about" element={<About />} />
            <Route path="/help-center" element={<Help_center />} />
          </Routes>
        </Router>
      </Provider>
    </>
  );
};

export default App;
