import prisma from "../../lib/prisma";

export const getCartByUserId = async (userId: string) => {
  return prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      },
    },
  });
};
export const createCart = async (userId: string) => {
  return prisma.cart.create({
    data: {
      userId,
    },
  });
};

export const findCartItem = async (cartId: string, productId: string) => {
  return prisma.cartItem.findFirst({
    where: {
      cartId,
      productId,
    },
  });
};

export const createCartItem = async (
  cartId: string,
  productId: string,
  quantity: number,
) => {
  return prisma.cartItem.create({
    data: {
      cartId,
      productId,
      quantity,
    },
  });
};

export const updateCartItem = async (itemId: string, quantity: number) => {
  return prisma.cartItem.update({
    where: {
      id: itemId,
    },
    data: {
      quantity,
    },
  });
};

export const deleteCartItem = async (itemId: string) => {
  return prisma.cartItem.delete({
    where: {
      id: itemId,
    },
  });
};

export const clearCart = async (cartId: string) => {
  return prisma.cartItem.deleteMany({
    where: {
      cartId,
    },
  });
};

export const getCartItemsById = async (userId: string) => {
  const cart:any =await prisma.cart.findUnique({
    where: {
      userId,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!cart) return [];

  let cartInfo={
    id:cart?.id,
    userId:cart?.userId
  }
  // return cart?.items.map((item) => ({
  //   // ...item,

  //   product: item.product, 
  // }));
  return cart
};
