import { Router } from "express";
import {chat} from "./chat.controller"
import {queryChat} from "./query.controller"
import { authMiddleware } from "../../middleware/auth.middleware";


const router = Router();

router.post("/chat",chat)
router.post("/query",queryChat)

export default router;