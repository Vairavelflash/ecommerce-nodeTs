import { Request, Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import {
  checkoutService,
  getMyOrderService,
  getOrderByIdService,
  updateOrderStatusService,
} from "./order.service";

// Checkout
export const checkoutController = async (req: AuthRequest, res: Response) => {
  const order = await checkoutService(req.user.id);

  res.json({
    success: true,
    data: order,
  });
};

// Orders
export const getMyOrdersController = async (
  req: AuthRequest,
  res: Response,
) => {
  const orders = await getMyOrderService(req.user.id);

  res.json({
    success: true,
    data: orders,
  });
};

// Order Details
export const getOrderByIdController = async (
  req: AuthRequest,
  res: Response,
) => {
  const order = await getOrderByIdService(req.params.id as string, req.user.id);

  res.json({
    success: true,
    data: order,
  });
};

export const updateOrderStatusController = async (
  req: Request,
  res: Response,
) => {
  const result = await updateOrderStatusService(
    req.params.orderId as string,
    req?.body?.status,
  );

  res.json({
    success: true,
    data: result,
  });
};
