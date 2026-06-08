import { Router } from "express";
import { loginController, logoutController, refreshTokenController, registerController } from "./auth.contoller";


const router = Router();

router.post('/signup',registerController)
router.post("/login",loginController);
router.post("/logout",logoutController);
router.post('/refresh', refreshTokenController);

export default router;