import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const isloggedIn = useSelector((store) => store.user.isloggedIn);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isloggedIn) {
      navigate("/login");
    }
  }, []);
  return <div>Profile</div>;
};

export default Profile;
