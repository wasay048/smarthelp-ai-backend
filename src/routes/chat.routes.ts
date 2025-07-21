import { Router } from "express";
import { ChatController } from "../controllers/chat.controller";

const router = Router();
const chatController = new ChatController();

router.post("/send", chatController.sendMessage.bind(chatController));
router.get("/history", chatController.getChatHistory.bind(chatController));

export default router;
