import Router from "express";
import {
  registerUser,
  loginUser,
  logOutUser,
  refreshAccessToken,
  changeCurrentPassword,
  changeAbout,
  toggleChat_Bot,
  changeUsername,
  deleteAccount,
  changeAvatar,
  searchUser,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = new Router();
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logOutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/change-about").post(verifyJWT, changeAbout);
router.route("/toggle-chat-bot").post(verifyJWT, toggleChat_Bot);
router.route("/change-username").post(verifyJWT, changeUsername);
router.route("/delete-account").delete(verifyJWT, deleteAccount);
router.route("/change-avatar").post(verifyJWT, changeAvatar);
router.route("/search-user").post(verifyJWT, searchUser);

export default router;
