import Router from "express";
import { getMessage, sendMessage } from "../controllers/message.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = new Router();

router.route("/send-message").post(verifyJWT, sendMessage);
router.route("/get-message").post(verifyJWT, getMessage);

export default router;
