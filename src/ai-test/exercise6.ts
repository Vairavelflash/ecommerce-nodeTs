import z from "zod";
import prisma from "../lib/prisma";
import { createAgent, tool } from "langchain";
import { ChatMistralAI } from "@langchain/mistralai";

const model = new ChatMistralAI({
  apiKey: process.env.AI_KEY,
  model: "mistral-small-latest",
});

function createGetOrdersTool(userId: string) {
  return tool(
    async () => {
      const orders = await prisma.order.findMany({
        where: {
          userId,
        },
      });

      return JSON.stringify(orders);
    },
    {
      name: "get_orders",
      description: "Get current user's orders",
      schema: z.object({}),
    },
  );
}

// const userId = req.user.id;
const userId = "2d578b77-3dd7-411a-998e-00dc25f9d2c8";

const agent = createAgent({
  model,
  tools: [createGetOrdersTool(userId)],
});

async function main() {
  const result = await agent.invoke({
    messages: [
      {
        role: "user",
        content: "Show my recent orders",
      },
    ],
  });

  console.log(result);
  console.dir(result, {
    depth: null,
  });
}

main();
