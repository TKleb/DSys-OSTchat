import express from "express"

const router = express.Router();
import chatController from "../controller/chat-controller.js";

router.get("/", chatController.index);
router.get("/chat/:id", chatController.chat)

export const chatRoutes = router;