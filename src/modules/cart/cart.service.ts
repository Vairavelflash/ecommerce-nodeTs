import prisma from "../../lib/prisma"
import { createCart, createCartItem, deleteCartItem, findCartItem, getCartByUserId, updateCartItem } from "./cart.repository"



export const addToCartService = async(userId:string,productId:string,quantity:number) =>{
    const product = await prisma.product.findUnique({
        where:{
            id:productId
        }
    })

    if(!product){
        throw new Error("Product not found")
    }

    if(product.isDeleted){
        throw new Error("Product unavailable")
    }

    let cart = await getCartByUserId(userId);
    

    if(!cart){
        cart = await createCart(userId)
    }
      const existingItem =
    await findCartItem(
      cart.id,
      productId
    );

 if (existingItem) {
    const totalQuantity =
      existingItem.quantity +
      quantity;

    if (totalQuantity > product.stock) {
      throw new Error(
        "Insufficient stock"
      );
    }

    return updateCartItem(
      existingItem.id,
      totalQuantity
    );
  }

  if (quantity > product.stock) {
    throw new Error(
      "Insufficient stock"
    );
  }

  return createCartItem(
    cart.id,
    productId,
    quantity
  );
}


export const getMyCartService =
  async (userId: string) => {
    const cart =
      await getCartByUserId(userId);

    if (!cart) {
      return {
        items: [],
        total: 0,
      };
    }

    const items =
      cart.items.map((item) => ({
        id: item.id,

        productId:
          item.product.id,

        name:
          item.product.name,

        price:
          item.product.price,

        quantity:
          item.quantity,

        subtotal:
          item.quantity *
          item.product.price,
      }));

    const total =
      items.reduce(
        (sum, item) =>
          sum + item.subtotal,
        0
      );

    return {
      items,
      total,
    };
  };


  export const updateCartItemService =
  async (
    itemId: string,
    quantity: number,
    userId: string
  ) => {
    const item =
      await prisma.cartItem.findUnique({
        where: {
          id: itemId,
        },
        include: {
          product: true,
          cart: true,
        },
      });

    if (!item) {
      throw new Error(
        "Item not found"
      );
    }

    if (
      item.cart.userId !== userId
    ) {
      throw new Error(
        "Unauthorized"
      );
    }

    if (
      quantity >
      item.product.stock
    ) {
      throw new Error(
        "Insufficient stock"
      );
    }

    return updateCartItem(
      itemId,
      quantity
    );
  };


  export const deleteCartItemService =
  async (
    itemId: string,
    userId: string
  ) => {
    const item =
      await prisma.cartItem.findUnique({
        where: {
          id: itemId,
        },
        include: {
          cart: true,
        },
      });

    if (!item) {
      throw new Error(
        "Item not found"
      );
    }

    if (
      item.cart.userId !== userId
    ) {
      throw new Error(
        "Unauthorized"
      );
    }

    return deleteCartItem(itemId);
  };