import { tool } from "langchain";
import prisma from "../../lib/prisma";
import z from "zod";

export const searchProductsTool = tool(
  async ({ query }) => {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
      take: 20,
    });
    return JSON.stringify(products);
  },
  {
    name: "search_products",
    description: "Search products by keyword, name, description",
    schema: z.object({
      query: z.string(),
    }),
  },
);
