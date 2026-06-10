import { createAgent, tool } from "langchain";
import prisma from "../lib/prisma";
import z from "zod";
import { ChatMistralAI } from "@langchain/mistralai";


const model = new ChatMistralAI({
  apiKey: "KQpq9x34XSgnQf2Be8ISxmsh12sxifRD",
  model: "mistral-small-latest",
});

const searchProductsTool = tool(
  async ({ query }) => {
    const products =
      await prisma.product.findMany({
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
        take: 5,
      });

    return JSON.stringify(products);
  },
  {
    name: "search_products",
    description:
      "Search products using keywords",
    schema: z.object({
      query: z.string(),
    }),
  }
);

const agent = createAgent({
  model,
  tools: [
    searchProductsTool,
  ],
});

async function main() {
    const result = await agent.invoke({
    messages:[
        {role:"user",
            content:"Tell me about iPhone"
        }
    ]
})

console.dir(result, { depth: null });
}

main()