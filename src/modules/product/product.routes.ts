import { Router } from "express";

import {
  createProductController,
  deleteProductController,
  getAllProductsController,
  getProductByIdController,
  getSearchProductsController,
  updateProductController,
} from "./product.controller";

import { authMiddleware } from "../../middleware/auth.middleware";

import { roleMiddleware } from "../../middleware/role.middleware";

const router = Router();

router.get("/", getAllProductsController);
router.get("/",getSearchProductsController)

router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  createProductController
);

router.get("/:id",getProductByIdController);
router.put("/:id",authMiddleware,roleMiddleware("ADMIN"),updateProductController)
router.delete("/:id",authMiddleware,roleMiddleware("ADMIN"),deleteProductController)



export default router;