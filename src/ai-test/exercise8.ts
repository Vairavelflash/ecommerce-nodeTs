import { createAgent, tool } from "langchain";
import prisma from "../lib/prisma";
import z from "zod";
import { ChatMistralAI } from "@langchain/mistralai";

const model = new ChatMistralAI({
  apiKey: process.env.AI_KEY,
  model: "mistral-small-latest",
});

function createGetMyCartTool(userId: string) {
  return tool(
    async () => {
      const cart = await prisma.cart.findUnique({
        where: {
          userId,
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
      return JSON.stringify(cart);
    },
    {
      name: "get_my_cart",
      description: "Get current user's cart",
      schema: z.object({}),
    },
  );
}

function createAddToCartTool(userId: string) {
  return tool(
    async ({ productName, quantity }: any) => {
      const product = await prisma.product.findFirst({
        where: {
          name: {
            contains: productName,
            mode: "insensitive",
          },
          isDeleted: false,
        },
      });

      if (!product) {
        return "Product not found";
      }

      let cart = await prisma.cart.findUnique({
        where: {
          userId,
        },
      });

      if (!cart) {
        cart = await prisma.cart.create({
          data: {
            userId,
          },
        });
      }

      const existingCartItem = await prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId: product.id,
        },
      });

      if (existingCartItem) {
        await prisma.cartItem.update({
          where: {
            id: existingCartItem.id,
          },
          data: {
            quantity: existingCartItem.quantity + quantity,
          },
        });
      } else {
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId: product.id,
            quantity,
          },
        });
      }

      return JSON.stringify({
        success: true,
        product: product.name,
        quantity,
      });
    },

    {
      name: "add_to_cart",
      description: "Add a product to the current user's cart",
      schema: z.object({
        productName: z.string(),
        quantity: z.number().min(1),
      }),
    },
  );
}

const userId = "2d578b77-3dd7-411a-998e-00dc25f9d2c8";

const agent = createAgent({
    model,
    tools:[
        createGetMyCartTool(userId),
        createAddToCartTool(userId)
    ],
    systemPrompt: `
    You are an ecommerce shopping assistant.

When user wants to add products to cart,
use add_to_cart tool.

When user asks about cart contents,
use get_my_cart tool.
    `
})

async function main() {
    const result = await agent.invoke({
    messages:[
        {role:"user",
            content:"Add 1 iPhone 15 Pro to my cart"
        }
    ]
})

console.dir(result, { depth: null });
}

main()
