import Router from "express";
import { sendHelp } from "../controllers/help.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = new Router();

router.route("/send-help").post(verifyJWT, sendHelp);

export default router;
