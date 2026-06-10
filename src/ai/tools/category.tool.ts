import { tool } from "@langchain/core/tools";
import { z } from "zod";
import prisma from "../../lib/prisma";

export const searchCategoriesTool = tool(
  async ({ query }) => {
    const categories = await prisma.category.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
    });

    return JSON.stringify(categories);
  },
  {
    name: "search_categories",
    description: "Search categories",
    schema: z.object({
      query: z.string(),
    }),
  },
);
