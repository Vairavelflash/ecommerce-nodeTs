import { tool } from "@langchain/core/tools";
import { z } from "zod";
import prisma from "../../lib/prisma";
import { Role } from "../../../generated/prisma";

export function searchOrderTool(userId: string, role: Role) {
  return tool(
    async ({ query }) => {
      const whereClause: any = {};

      // USER can only see own orders
      if (role !== "ADMIN") {
        whereClause.userId = userId;
      }

      const orders = await prisma.order.findMany({
        where: whereClause,
        include: {
          items: true,
        },
        take: 10,
        orderBy: {
          created_at: "desc",
        },
      });

      return JSON.stringify(orders);
    },
    {
      name: "search_orders",
      description:
        `Search ecommerce orders.
        Use this tool when users ask about:
        - their orders
        - order history
        - latest orders
        - pending orders
        - completed orders`,
      schema: z.object({
        query: z.string(),
      }),
    },
  );
}
