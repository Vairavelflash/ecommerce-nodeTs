import { Request, Response } from "express";
import { ecommerceAgent } from "../../ai/ecommerce-agent";
import { HumanMessage } from "langchain";

export async function queryChat(req: Request, res: Response) {
  try {
    const { prompt,userId,role } = req.body;

    // res.setHeader("Content-Type", "text/event-stream");
    // res.setHeader("Cache-Control", "no-cache");
    // res.setHeader("Connection", "keep-alive");

    // res.flushHeaders();

    // const agent = ecommerceAgent(req.user.id,req.user.role)
    const agent = ecommerceAgent(userId,role)


    const stream = await agent.invoke({
      messages: [new HumanMessage(prompt)],
    });

    //  console.dir(stream, { depth: null });

    const lastMessage =
      stream.messages[stream.messages.length - 1];

    return res.status(200).json({
      success: true,
      response: lastMessage.content,
    });
  } catch (err:any) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: err?.message
    });
  }
}
