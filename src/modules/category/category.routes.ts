import { Router } from "express";
import { createCategoryController, getAllCategoriesContoller } from "./category.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { roleMiddleware } from "../../middleware/role.middleware";

const router = Router()


router.get("/",getAllCategoriesContoller);


router.post("/",authMiddleware,roleMiddleware("ADMIN"),createCategoryController);

export default router;