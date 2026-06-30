import { tool } from "@langchain/core/tools";
import z from "zod";
import { embeddings } from "../../lib/embedding";
import prisma from "../../lib/prisma";

export const searchDocumentTool = tool(
  async ({ query }: any) => {
    //Generate embedding from question
    const questionVector = await embeddings.embedQuery(query);
//  console.log(questionVector.length);

    const vector = `[${questionVector.join(",")}]`;

    // Search in DB
    const resultDb: any = await prisma.$queryRaw`
            SELECT chunk,embedding <=> ${vector}::vector AS distance
            FROM "DocumentChunk"
            ORDER BY embedding <=> ${vector}::vector
            LIMIT 5`;

    // console.log(resultDb)

    if (!resultDb.length) {
      return "No relevant documents found.";
    }

    const context = resultDb.map((item: any) => item.chunk).join("\n\n");

    return context;
  },
  {
    name: "search_document",
    description:
      "search documents, PDFs and knowledge base. Use this whenever the user asks about information stored inside uploaded documents.",
    schema: z.object({
      query: z.string(),
    }),
  },
);
