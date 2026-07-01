import { generateOrderNumber } from "../../common/utils/order-number";
import prisma from "../../lib/prisma";
import { getUserOrder } from "./order.repository";

export const checkoutService = async (userId: string) => {
  const cart = await prisma.cart.findUnique({
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

  if (!cart || cart.items.length == 0) {
    throw new Error("Cart is empty");
  }

  return prisma.$transaction(async (tx) => {
    let totalAmount = 0;
    for (const item of cart.items) {
      if (item.quantity > item.product.stock) {
        throw new Error(`${item.product.name} has insufficient stock`);
      }

      totalAmount += item.quantity * item.product.price;
    }
    // 2
    const order = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId,
        totalAmount,
      },
    });
    // 3
    for (const item of cart.items) {
      const subtotal = item.quantity * item.product.price;

      await tx.orderItem.create({
        data: {
          orderId: order.id,

          productId: item.productId,

          quantity: item.quantity,

          unitPrice: item.product.price,

          subtotal,
        },
      });

      await tx.product.update({
        where: {
          id: item.productId,
        },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });

      await tx.cartItem.deleteMany({
        where: {
          cartId: cart.id,
        },
      });
    }
  });
};

export const getMyOrderService = async (userId: string) => {
  const orders = await getUserOrder(userId);

  const flatternOrders = orders.map((order) => ({
    ...order,
    items: order.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      subtotal: item.subtotal,
      // Flattened product fields
      productId: item.product?.id,
      productName: item.product?.name,
      productImageUrl: item.product?.imageUrl,
    })),
  }));

  return flatternOrders;
};

export const getOrderByIdService = async (orderId: string, userId: string) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
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

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
};

export const updateOrderStatusService = async (
  orderId: string,
  newStatus: string,
) => {
  // console.log("first", orderId, newStatus);
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (newStatus === "CANCELLED") {
    const orderWIthItems = await prisma.order.findUnique({
      where: {
        id: orderId,
      },

      include: {
        items: true,
      },
    });

    await prisma.$transaction(async (tx) => {
      for (const item of orderWIthItems!.items) {
        await tx.product.update({
          where: {
            id: item.productId,
          },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      }
    });
  }

  return prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      status: newStatus as any,
    },
  });
};
