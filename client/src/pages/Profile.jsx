import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useToggleChat_Bot from "../hooks/useToggleChat_Bot";
import useDeleteAccount from "../hooks/useDeleteAccount";
import ChangeProfile from "../components/ChangeProfile";
import { setChange_Profile } from "../store/slices/userSlice";
import Change_Avatar from "../components/Change_Avatar";
import { lang } from "../utils/constants";

const Profile = () => {
  const [changeProfile, setChangeProfile] = useState(false);
  const [changeAvatar, setChangeAvatar] = useState(false);
  const ln = useSelector((store) => store.user.ln);
  const isloggedIn = useSelector((store) => store.user.isloggedIn);
  const user = useSelector((store) => store.user.User);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toggleChat_bot } = useToggleChat_Bot();
  const { delete_account } = useDeleteAccount();
  const options1 = [
    {
      name: lang[ln].username,
      label: "Username",
      value: user.username,
      disabled: true,
    },
    {
      name: lang[ln].password,
      label: "Password",
      value: "********",
      disabled: true,
    },
    {
      name: lang[ln].about,
      label: "About",
      value: user?.about,
      disabled: true,
    },
  ];
  const options2 = [
    {
      name: lang[ln].Chat_Bot,
      label: "Chat Bot",
      value: `${user.Chat_Bot}`,
      disabled: true,
      function: () => toggleChat_bot(),
    }
  ];
  useEffect(() => {
    if (!isloggedIn) {
      navigate("/login");
    }
  }, []);
  return (
    <div className="bg-gradient-to-r from-black via-gray-900 to-black">
      {changeProfile && <ChangeProfile setChangeProfile={setChangeProfile} />}
      {changeAvatar && <Change_Avatar setChangeAvatar={setChangeAvatar} />}
      <div className="lg:h-screen min-h-screen grid grid-cols-2 gap-5 mt-16">
        <div className="md:col-span-1 col-span-2 w-full flex pt-16 f flex-col items-center gap-10">
          {options1.map((item) => {
            return (
              <div className="w-[80%]" key={item.label}>
                <label className="label">
                  <span className="label-text mx-2">{item.name}</span>
                </label>
                <input
                  type="text"
                  value={item.value}
                  className="input input-bordered w-[70%] mx-2 mb-2"
                  disabled={item.disabled}
                />
                <button
                  className="btn w-[20%]"
                  onClick={() => {
                    setChangeProfile(true);
                    dispatch(setChange_Profile(item.label));
                  }}
                >
                  {lang[ln].Change}
                </button>
              </div>
            );
          })}
          <div className="w-[80%]">
            <label className="label">
              <span className="label-text mx-2">{lang[ln].Avatar}</span>
            </label>
            <input
              type="text"
              value={user.avatar}
              className="input input-bordered w-[70%] mx-2 mb-2"
              disabled
            />
            <button
              className="btn w-[20%]"
              onClick={() => {
                setChangeAvatar(true);
              }}
            >
              {lang[ln].Change}
            </button>
          </div>
        </div>
        <div className="md:col-span-1 col-span-2 w-full  pt-16 flex flex-col items-center gap-10">
          {options2.map((item) => {
            return (
              <div className="w-[80%]" key={item.label}>
                <label className="label">
                  <span className="label-text mx-2">{item.name}</span>
                </label>
                <input
                  type="text"
                  value={item.value}
                  className="input input-bordered w-[70%] mx-2 mb-2"
                  disabled={item.disabled}
                />
                <button className="btn w-[20%]" onClick={item.function}>
                  {lang[ln].Toggle}
                </button>
              </div>
            );
          })}
          <div className="w-[80%]">
            <label className="label">
              <span className="label-text mx-2">{lang[ln].Email}</span>
            </label>
            <input
              type="text"
              placeholder={user.email}
              className="input input-bordered w-[92%] mx-2 mb-2"
              disabled
            />
          </div>
          <div className="w-[80%] px-2 pt-10 ">
            <button
              className="btn w-full bg-red-700 text-white hover:bg-red-600"
              onClick={() => delete_account()}
            >
              {lang[ln].Delete_Account}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
