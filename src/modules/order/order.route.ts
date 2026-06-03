import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { checkoutController, getMyOrdersController, getOrderByIdController, updateOrderStatusController } from "./order.controller";
import { roleMiddleware } from "../../middleware/role.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/checkout",checkoutController)
router.get("/",getMyOrdersController)
router.get("/:id",getOrderByIdController)
router.patch("/:orderId/status",roleMiddleware("ADMIN"),updateOrderStatusController)


export default router;