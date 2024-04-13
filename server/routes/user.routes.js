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

export default router;
