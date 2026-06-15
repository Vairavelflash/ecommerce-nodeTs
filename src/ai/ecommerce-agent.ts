import { ChatMistralAI } from "@langchain/mistralai";
import { createAgent } from "langchain";
import { searchProductsTool } from "./tools/product.tool";
import { searchOrderTool } from "./tools/order.tool";
import { searchCategoriesTool } from "./tools/category.tool";
import { Role } from "../../generated/prisma";
import { searchUserTool } from "./tools/user.tool";

const model = new ChatMistralAI({
  apiKey: process.env.AI_KEY,
  model: "mistral-small-latest",
  temperature: 0.3,
});

export const ecommerceAgent = (userId: string, role: Role) => {
  return createAgent({
    model,
    tools: [
      searchProductsTool,
      searchCategoriesTool,
      searchOrderTool(userId, role),
      searchUserTool(role),
    ],
    systemPrompt: `
    You are an ecommerce assistant.

Use available tools whenever product information is required.

Always answer in natural language.
    `,
  });
};
