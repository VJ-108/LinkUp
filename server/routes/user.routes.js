import Router from "express";
import {
  registerUser,
  loginUser,
  logOutUser,
  refreshAccessToken,
  changeCurrentPassword,
    changeAbout,
  getLastseen,
  updateLastseen,
  toggleChat_Bot,
  toggleChat_type,
  toggleBlocked_id,
  getBlocked_ids,
  toggleContact_id,
  getContact_ids,
  getUserId,
  changeUsername,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = new Router();
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logOutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/change-about").post(verifyJWT, changeAbout);
router.route("/lastseen").get(verifyJWT, getLastseen);
router.route("/update-lastseen").post(verifyJWT, updateLastseen);
router.route("/toggle-chat-bot").post(verifyJWT, toggleChat_Bot);
router.route("/toggle-chat-type").post(verifyJWT, toggleChat_type);
router.route("/toggle-blocked-id").post(verifyJWT, toggleBlocked_id);
router.route("/get-blocked-ids").get(verifyJWT, getBlocked_ids);
router.route("/toggle-contact-id").post(verifyJWT, toggleContact_id);
router.route("/get-contact-ids").get(verifyJWT, getContact_ids);
router.route("/get-user-id").post(verifyJWT, getUserId);
router.route("/change-username").post(verifyJWT, changeUsername);

export default router;
