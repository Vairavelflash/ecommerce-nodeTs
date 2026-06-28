import { MistralAIEmbeddings } from "@langchain/mistralai";

export const embeddings = new MistralAIEmbeddings({
  apiKey: process.env.AI_KEY,
  model: "mistral-embed",
});
