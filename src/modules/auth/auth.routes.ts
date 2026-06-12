import { Router } from "express";
import { authmeController, loginController, logoutController, refreshTokenController, registerController } from "./auth.contoller";
import { authMiddleware } from "../../middleware/auth.middleware";


const router = Router();

router.post('/signup',registerController)
router.post("/login",loginController);
router.post("/logout",logoutController);
router.post('/refresh', refreshTokenController);
router.get("/me",authMiddleware,authmeController)

export default router;