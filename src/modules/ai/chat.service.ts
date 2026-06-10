import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatMistralAI } from "@langchain/mistralai";

const model = new ChatMistralAI({
  apiKey: "KQpq9x34XSgnQf2Be8ISxmsh12sxifRD",
  model: "mistral-small-latest",
  temperature: 0.7,
});


const prompt = ChatPromptTemplate.fromTemplate(`
You are a helpful AI assistant.

Question:
{question}
(not more than 20 words)
`);

const chain = prompt.pipe(model);

export async function streamChat(question:string) {
    return chain.stream({
        question
    })
}