import express from "express"

const router = express.Router();
import chatController from "../controller/chat-controller.js";

router.get("/", chatController.index);

export const chatRoutes = router;