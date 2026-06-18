import { Router } from "express";

import {
  addToCartController,
  getCartController,
  updateCartItemController,
  deleteCartItemController,
  getCartItemsController,
} from "./cart.controller";

import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/", getCartController);

router.post(
  "/items",
  addToCartController
);

router.patch(
  "/items/:itemId",
  updateCartItemController
);

router.delete(
  "/items/:itemId",
  deleteCartItemController
);

export default router;