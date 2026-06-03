import { Router } from "express";
import { loginController, logoutController, registerController } from "./auth.contoller";


const router = Router();

router.post('/signup',registerController)
router.post("/login",loginController);
router.post("/logout",logoutController);

export default router;