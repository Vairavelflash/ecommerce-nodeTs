import prisma from "../../lib/prisma";

type CreateProductInput = {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  categoryId: string;
  isDeleted?: boolean;
};

export const createProduct = async (data: CreateProductInput) => {
  return prisma.product.create({
    data,
  });
};

export const getAllProducts = async () => {
  return prisma.product.findMany({
    where:{
      isDeleted: false,
    },
    orderBy: {
      created_at: "desc",
    },
  });
};

export const getProductsById = async (id: string) => {
  return prisma.product.findFirst({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      category: true,
    },
  });
};

export const getSearchProducts = async (search?: string) => {
  return prisma.product.findMany({
    where: {
      isDeleted: false,

      ...(search && {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            description: search,
            mode: "insensitive",
          },
        ],
      }),
    },
    orderBy: {
      created_at: "desc",
    },
  });
};

export const getSearchProducts2 = async (q: string) => {
  return prisma.product.findMany({
    where: {
      isDeleted: false,
      OR: [
        {
          name: {
            contains: q as string,
            // mode: "insensitive",
          },
        },
        {
          description: q as string,
        //   mode: "insensitive",
        },
      ],
    },
  });
};

export const updateProduct = async (id: string, data: any) => {
  return prisma.product.update({
    where: {
      id,
    },
    data,
  });
};

export const deleteProduct = async (id: string) => {
  return prisma.product.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
    },
  });
};
