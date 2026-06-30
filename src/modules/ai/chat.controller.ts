import { Request, Response } from "express";
import { streamChat } from "./chat.service";
import { searchDocumentTool } from "../../ai/tools/searchDocumentTool";
import { aiAgent } from "../../ai/ai.agent";

// export async function chat(req: Request, res: Response) {
//   try {
//     const { prompt } = req.body;

//     if (!prompt) {
//       return res.status(400).json({
//         message: "Question is required",
//       });
//     }

//     res.setHeader("Content-Type", "text/event-stream");
//     res.setHeader("Cache-Control", "no-cache");
//     res.setHeader("Connection", "keep-alive");

//     res.flushHeaders();

//     res.write("data: Connected\n\n");

//     const stream = await streamChat(prompt);

//     for await (const chunk of stream) {
//       const content = chunk.content;

//       if (!content) continue;

//       const text =
//         typeof content === "string" ? content : JSON.stringify(content);

//       res.write(`data: ${text}\n\n`)

//     }

//     res.write("data: [DONE]\n\n");
//     res.end();
//   } catch (error) {
//     console.error(error);
//     res.write("data: Error Occurred\n\n");
//     res.end();
//   }
// }

export async function chat(req: Request, res: Response) {
  const { prompt } = req.body;

  const agent = aiAgent();
  const response = await agent.invoke({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  // console.log(response);
  const lastMessage = response.messages?.at(-1);
  return res.json({
    success: true,
    content: lastMessage?.content,
  });
}
