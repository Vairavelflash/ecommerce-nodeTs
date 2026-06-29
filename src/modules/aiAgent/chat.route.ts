import { Router } from "express";
import { queryChat } from "./query.controller";


const router = Router();

router.post("/query",queryChat)

export default router;