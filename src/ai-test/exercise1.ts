import { ChatMistralAI } from "@langchain/mistralai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import prisma from "../lib/prisma";

const model = new ChatMistralAI({
  apiKey: "KQpq9x34XSgnQf2Be8ISxmsh12sxifRD",
  model: "mistral-small-latest",
});

// model.invoke()
async function main1() {
  const product = await prisma.product.findFirst();

  console.log(product);

  const response = await model.invoke(`
        Product name: ${product?.name}
        
        Write a professional ecommerce description (not more than 20 words)`);

  console.log(response);
}

// main1();

const prompt = ChatPromptTemplate.fromTemplate(`
    You are an ecommerce copywriter.
    Product Name:
{name}
Product Description:
{description}
Price:
${"{price}"}
Generate:
1. Short tagline
2. Marketing description

(not more than 20 words)
`);
//ChatPromptTemplate
async function main2() {
  const product = await prisma.product.findFirst();

  console.log(product?.name);

  const formattedPrompt = await prompt.invoke({
    name: product?.name,
    description: product?.description,
    price: product?.price,
  });

  console.log(formattedPrompt);
}

// main2()

// pipe()
async function main3() {
  const product = await prisma.product.findFirst();

  console.log(product?.name);

  const chain = prompt.pipe(model);

  const formattedPrompt = await chain.invoke({
    name: product?.name,
    description: product?.description,
    price: product?.price,
  });

  console.log(formattedPrompt);
}

// main3()

const prompt4 = ChatPromptTemplate.fromTemplate(`
   You are an ecommerce SEO expert.

Generate:

- Product Title
- SEO Description
- 5 Marketing Keywords

Product Name: {name}
Description: {description}
Price: {price} (not more than 20 words) `);
async function main4() {
  const product = await prisma.product.findFirst();
  const chain = prompt4.pipe(model);
  const response = await chain.invoke({
    name: product?.name,
    description: product?.description,
    price: product?.price,
  });

  console.log(response);
}

main4();
