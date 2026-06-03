import { Request, Response } from "express";

import {
  createProductService,
  deleteProductService,
  getAllProductsService,
  getProductByIdService,
  getSearchProductsService,
  updateProductService,
} from "./product.service";
import prisma from "../../lib/prisma";

export const createProductController = async (req: Request, res: Response) => {
  const product = await createProductService(req.body);

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    product,
  });
};

export const getAllProductsController = async (
  _req: Request,
  res: Response,
) => {
  const products = await getAllProductsService();

  res.status(200).json({
    success: true,
    products,
  });
};

export const getProductByIdController = async (req: Request, res: Response) => {
  const product = await getProductByIdService(req.params.id as string);

  res.status(200).json({
    success: true,
    data: product,
  });
};

export const updateProductController = async (req: Request, res: Response) => {
  const product = await updateProductService(req.params.id as string, req.body);

  res.status(200).json({
    success: true,
    data: product,
  });
};

export const deleteProductController = async (req: Request, res: Response) => {
  await deleteProductService(req.params.id as string);

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
};

export const getSearchProductsController = async (
  req: Request,
  res: Response,
) => {
  const { q } = req.query;
  console.log("first", q);

  // const products = await getSearchProductsService(q);

  const where: any = {};

  if (q) {
    where.OR = [
      { name: { contains: q as string, mode: "insensitive" } },
      { description: { contains: q as string, mode: "insensitive" } },
    ];
  }
  const products = await prisma.product.findMany({
    where,
  });

  res.status(200).json({
    success: true,
    data: products,
  });
};
