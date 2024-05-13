import Router from "express";
import {
  createGroup,
  getGroup,
  toggleMember,
  toggleAdmin,
  changeAbout,
  deleteGroup,
  leaveGroup,
} from "../controllers/group.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = new Router();

router.route("/create-group").post(verifyJWT, createGroup);
router.route("/get-group").post(verifyJWT, getGroup);
router.route("/toggle-member").post(verifyJWT, toggleMember);
router.route("/toggle-admin").post(verifyJWT, toggleAdmin);
router.route("/change-about").post(verifyJWT, changeAbout);
router.route("/delete-group").post(verifyJWT, deleteGroup);
router.route("/leave-group").post(verifyJWT, leaveGroup);

export default router;
