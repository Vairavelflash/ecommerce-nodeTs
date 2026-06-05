import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { addToCartService, deleteCartItemService, getMyCartService, updateCartItemService } from "./cart.service";

export const addToCartController =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    console.log(req.body,req.user)
    const result =
      await addToCartService(
        req.user.id,
        // req.body.userId,
        req.body.productId,
        req.body.quantity
      );

    res.status(201).json({
      success: true,
      data: result,
    });
  };

export const getCartController =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    const result =
      await getMyCartService(
        req.user.id
      );

    res.json({
      success: true,
      data: result,
    });
  };


  export const updateCartItemController =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    const result =
      await updateCartItemService(
        req.params.itemId as string,
        req.body.quantity,
        req.user.id
      );

    res.json({
      success: true,
      data: result,
    });
  };

  export const deleteCartItemController =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    await deleteCartItemService(
      req.params.itemId as string,
      req.user.userId
    );

    res.json({
      success: true,
      message:
        "Item removed",
    });
  };