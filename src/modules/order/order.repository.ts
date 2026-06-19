import prisma from "../../lib/prisma";

export const getUserOrder = async (userId: string) => {
  return prisma.order.findMany({
    where: {
      userId,
    },
    include: {
      items: {
        select: {
          id: true,
          quantity: true,
          unitPrice: true,
          subtotal: true,
           product: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
            },
          },
        },
      },
    },
   orderBy: {
      created_at: "desc",
    },
  });
};
