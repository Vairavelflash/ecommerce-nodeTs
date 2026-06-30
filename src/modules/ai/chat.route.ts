import { Router } from "express";
import {chat} from "./chat.controller"
import { authMiddleware } from "../../middleware/auth.middleware";
import { ragChat } from "./rag.controller";
import multer from "multer"
import { ragAsk } from "./ragask.controller";

const router = Router();

const upload = multer({
    dest: "uploads/"
});

router.post("/chat",chat)
// router.post("/rag",upload.single("file"),ragChat)
// router.post("/rag/ask",ragAsk)

export default router;