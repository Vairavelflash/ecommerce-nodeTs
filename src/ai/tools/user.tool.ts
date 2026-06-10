import { tool } from "@langchain/core/tools";
import { z } from "zod";
import prisma from "../../lib/prisma";
import { Role } from "../../../generated/prisma";

export function searchUserTool(
  role: Role
) {
  return tool(
    async ({ query }) => {
      if (role !== "ADMIN") {
        return "Access denied";
      }

      const users =
        await prisma.user.findMany({
          where: {
            OR: [
              {
                name: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              {
                email: {
                  contains: query,
                  mode: "insensitive",
                },
              },
            ],
          },
          take: 20,
        });

      return JSON.stringify(users);
    },
    {
      name: "search_users",
      description:
        "Search users by name or email. Admin only.",
      schema: z.object({
        query: z.string(),
      }),
    }
  );
}