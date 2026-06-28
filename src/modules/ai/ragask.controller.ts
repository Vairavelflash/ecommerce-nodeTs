import { Request, Response } from "express";
import { embeddings } from "../../lib/embedding";
import prisma from "../../lib/prisma";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { model } from "./chat.service";

const prompt = ChatPromptTemplate.fromTemplate(`
    You are a helpful assistant.

Answer ONLY using the context below.

If the answer is not found in the context, say:
"I don't have enough information to answer that."

Context:
{context}

Question:
{question}
    `)

export async function ragAsk(req:Request,res:Response) {
const {question} = req.body;

    //Generate embedding from question
    const questionVector = await embeddings.embedQuery(question);
    
    const vector = `[${questionVector.join(",")}]`;

    // Search in DB
    const resultDb:any = await prisma.$queryRaw`
    SELECT chunk,embedding <=> ${vector}::vector AS distance
    FROM "DocumentChunk"
    ORDER BY embedding <=> ${vector}::vector
    LIMIT 5`

    // console.log(resultDb)

    const context = resultDb.map((item:any) => item.chunk).join("\n\n");


    const formattedPrompt = await prompt.format({
    context,
    question,
});

// Send Response Bulk
// const response = await model.invoke(formattedPrompt);

//     return res.json({
//         answer: response.content,
//     })

// Send Response in chunk
 res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        const responseStream = await model.stream(formattedPrompt);

        for await(const chunk of responseStream){
            const textChunk = typeof chunk === "string" ? chunk : chunk.content;

            // res.write(textChunk);

            if(textChunk){
                res.write(`data: ${JSON.stringify({text:textChunk})}\n\n`);

                // if(typeof (res as any).flush === "function"){
                //     (res as any).flush();
                // }
            }
        }

        res.write("event: end\ndata:[DONE]\n\n")

        return res.end()
}