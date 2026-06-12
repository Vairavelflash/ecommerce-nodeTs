import { Router } from "express";
import {
  createCategoryController,
  getAllCategoriesContoller,
  getCategoryContoller,
  getCategoryListController
} from "./category.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { roleMiddleware } from "../../middleware/role.middleware";

const router = Router();

router.get("/", getAllCategoriesContoller);
router.get("/list",getCategoryListController)
router.get("/:name", getCategoryContoller);


router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  createCategoryController,
);

export default router;
