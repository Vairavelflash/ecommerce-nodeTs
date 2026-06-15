import { ChatMistralAI } from "@langchain/mistralai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import prisma from "../lib/prisma";
import { z } from "zod";

const model = new ChatMistralAI({
  apiKey: process.env.AI_KEY,
  model: "mistral-small-latest",
});

const SeoSchema = z.object({
  title: z.string(),
  seoDescription: z.string(),
  keywords: z.array(z.string()),
});

const prompt = ChatPromptTemplate.fromTemplate(`
   You are an ecommerce SEO expert.

Generate:

- Product 
- SEO Description
- 5 Marketing Keywords

Product Name: {name}
Description: {description}
Price: {price}
 (not more than 20 words) `);

async function main() {
  const product = await prisma.product.findFirst();

  const structuredModel = model.withStructuredOutput(SeoSchema);

  const chain = prompt.pipe(structuredModel);
  const result = await chain.invoke({
    name: product?.name,
    description: product?.description,
    price: product?.price,
  });
  console.log(result);
}

main();
