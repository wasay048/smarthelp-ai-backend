import { Router } from "express";
import { generateEmbedCode } from "../controllers/embed.controller";

const router = Router();

// Route to generate embed code for the chatbot
router.post("/generate", generateEmbedCode);

export default router;
