import { tool } from "@langchain/core/tools";
import prisma from "../lib/prisma";
import z from "zod";
import { ChatMistralAI } from "@langchain/mistralai";

const model = new ChatMistralAI({
  apiKey: process.env.AI_KEY,
  model: "mistral-small-latest",
});

const getProductTool = tool(
  async ({ productName }: any) => {
    const product = await prisma.product.findFirst({
      where: {
        name: {
          contains: productName,
          mode: "insensitive",
        },
      },
    });
    return JSON.stringify(product);
  },
  {
    name: "get_product",
    description: "Search a product by name",
    schema: z.object({
      productName: z.string(),
    }),
  },
);

async function main() {
  const modelWithTools = model.bindTools([getProductTool]);

  const response = await modelWithTools.invoke("Do you have iPhone products?");

  console.log(response.tool_calls);

  for (const call of response.tool_calls ?? []) {
    const result = await getProductTool.invoke(call.args);

    console.log(result);
  }
}

main();
