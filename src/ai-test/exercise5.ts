import { tool } from "@langchain/core/tools";
import prisma from "../lib/prisma";
import z from "zod";
import { ChatMistralAI } from "@langchain/mistralai";
import { createAgent, createToolCallTransformer } from "langchain";

const model = new ChatMistralAI({
  apiKey: process.env.AI_KEY,
  model: "mistral-small-latest",
});

// Find Product
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
    description: "FInd a product by name",
    schema: z.object({
      productName: z.string(),
    }),
  },
);

// Get Category
const getCategoryTool = tool(
  async ({ categoryName }) => {
    const category = prisma.category.findFirst({
      where: {
        name: {
          contains: categoryName,
          mode: "insensitive",
        },
      },
    });
    return JSON.stringify(category);
  },
  {
    name: "get_category",
    description: "Find category by name",
    schema: z.object({
      categoryName: z.string(),
    }),
  },
);

const getOrdersTool = tool(
  async ({ email }) => {
    const orders = await prisma.order.findMany({
      where: {
        user: {
          email,
        },
      },
      take: 5,
    });

    return JSON.stringify(orders);
  },
  {
    name: "get_orders",
    description: "Get user orders",
    schema: z.object({
      email: z.string(),
    }),
  },
);



const getProductsByCategoryTool = tool(
  async ({ categoryName }: any) => {
    const category = await prisma.category.findFirst({
      where: {
        name: {
          equals: categoryName,
          mode: "insensitive",
        },
      },
    });
    if (!category?.id) {
      return null;
    }
    const product = await prisma.product.findMany({
      where: {
        categoryId: category?.id,
      },
      select: {
        name: true,
      },
    });

    return JSON.stringify(product);
  },
  {
    name: "get_products_by_category",
    description: "Get Products by Category",
    schema: z.object({
      categoryName: z.string(),
    }),
  },
);

const getStockTool = tool(
    async({productName}) =>{
        const product = await prisma.product.findFirst({
            where:{
                name:{
                    contains:productName,
                    mode:"insensitive"
                },
            },
            select:{
                name:true,
                stock:true
            }
        })
        return JSON.stringify(product)
    },{
        name:"get_stock",
        description:"Get stock information",
        schema:z.object({
            productName:z.string()
        })
    }
)

const agent = createAgent({
    model,
    tools:[
        getProductTool,
        getCategoryTool,
        getProductsByCategoryTool,
        getOrdersTool,
        getStockTool
    ],
    systemPrompt:`
    You are an ecommerce shopping assistant.

    Help users find products.
    Always use tools when product information is required.
    `
})

async function main() {
const result = await agent.invoke({
  messages: [
    {
      role: "user",
      content: "Tell me about iPhone",
    },
  ],
});

console.log(result);
console.dir(result, {
  depth: null,
});
}

main();
