import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createAgent } from "langchain";
import { ChatMistralAI } from "@langchain/mistralai";

import { searchDocumentTool } from "./tools/searchDocumentTool";

const model = new ChatMistralAI({
  apiKey: process.env.AI_KEY,
  model: "mistral-small-latest",
  temperature: 0.3,
});

export const aiAgent = () => {
  return createAgent({
    model,
    tools: [searchDocumentTool],
    systemPrompt: `
    You are a helpful AI assistant.

You have access to tools.

Rules:

1. If the user asks about information that may exist in uploaded PDFs,
use the search_document tool.

2. If the question is a normal conversation,
answer directly.

3. Never invent information.

4. If the tool returns no information,
say you couldn't find it.
    `,
  });
};
