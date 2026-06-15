import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes"
import productRoutes from "../modules/product/product.routes"
import categoryRoutes from "../modules/category/category.routes";
import cartRoutes from "../modules/cart/cart.routes"
import orderRoutes from "../modules/order/order.route";
import aiRoutes from "../modules/ai/chat.route"
import uploadRoutes from "../modules/uploads/upload.routes"

const router = Router();

router.use("/auth",authRoutes)
router.use("/categories",categoryRoutes)
router.use("/products",productRoutes)
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes)
// router.use("/ai",aiRoutes)
router.use("/uploads",uploadRoutes)

export default router;