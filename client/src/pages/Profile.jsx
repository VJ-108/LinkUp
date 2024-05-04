import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useToggleChat_Type from "../hooks/useToggleChat_Type";
import useToggleChat_Bot from "../hooks/useToggleChat_Bot";
import useDeleteAccount from "../hooks/useDeleteAccount";
import ChangeProfile from "../components/ChangeProfile";
import { setChange_Profile } from "../store/slices/userSlice";

const Profile = () => {
  const [changeProfile, setChangeProfile] = useState(false);
  const isloggedIn = useSelector((store) => store.user.isloggedIn);
  const user = useSelector((store) => store.user.User);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toggleChat_bot } = useToggleChat_Bot();
  const { toggleChat_type } = useToggleChat_Type();
  const { delete_account } = useDeleteAccount();
  const options1 = [
    {
      label: "Username",
      value: user.username,
      disabled: true,
    },
    {
      label: "Password",
      value: "********",
      disabled: true,
    },
    {
      label: "About",
      value: user?.about,
      disabled: true,
    },
    {
      label: "Avatar",
      value: user.avatar,
      disabled: true,
    },
  ];
  const options2 = [
    {
      label: "Chat Bot",
      value: `${user.Chat_Bot}`,
      disabled: true,
      function: () => toggleChat_bot(),
    },
    {
      label: "Chat Type",
      value: user.chat_type,
      disabled: true,
      function: () => toggleChat_type(),
    },
  ];
  useEffect(() => {
    if (!isloggedIn) {
      navigate("/login");
    }
  }, []);
  return (
    <div className="bg-gradient-to-r from-black via-gray-900 to-black">
      {changeProfile && <ChangeProfile setChangeProfile={setChangeProfile} />}
      <div className="lg:h-screen min-h-screen grid grid-cols-2 gap-5 mt-16">
        <div className="md:col-span-1 col-span-2 w-full flex pt-16 f flex-col items-center gap-10">
          {options1.map((item) => {
            return (
              <div className="w-[80%]" key={item.label}>
                <label className="label">
                  <span className="label-text mx-2">{item.label}</span>
                </label>
                <input
                  type="text"
                  value={item.value}
                  className="input input-bordered w-[75%] mx-2 mb-2"
                  disabled={item.disabled}
                />
                <button
                  className="btn w-[20%]"
                  onClick={() => {
                    setChangeProfile(true);
                    dispatch(setChange_Profile(item.label));
                  }}
                >
                  Change
                </button>
              </div>
            );
          })}
        </div>
        <div className="md:col-span-1 col-span-2 w-full  pt-16 flex flex-col items-center gap-10">
          {options2.map((item) => {
            return (
              <div className="w-[80%]" key={item.label}>
                <label className="label">
                  <span className="label-text mx-2">{item.label}</span>
                </label>
                <input
                  type="text"
                  value={item.value}
                  className="input input-bordered w-[75%] mx-2 mb-2"
                  disabled={item.disabled}
                />
                <button className="btn w-[20%]" onClick={item.function}>
                  Toggle
                </button>
              </div>
            );
          })}
          <div className="w-[80%]">
            <label className="label">
              <span className="label-text mx-2">Email</span>
            </label>
            <input
              type="text"
              placeholder={user.email}
              className="input input-bordered w-[97%] mx-2 mb-2"
              disabled
            />
          </div>
          <div className="w-[80%] px-2 pt-10 ">
            <button
              className="btn w-full bg-red-700 text-white hover:bg-red-600"
              onClick={() => delete_account()}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
