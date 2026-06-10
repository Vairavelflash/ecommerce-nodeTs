import { Request, Response } from "express";
import { streamChat } from "./chat.service";



export async function chat(req:Request,res:Response) {
    try {
        const {question} = req.body;

        if(!question){
            return res.status(400).json({
                message:"Question is required"
            })
        }

        res.setHeader("Content-Type","text/event-stream");
        res.setHeader("Cache-Control","no-cache");
        res.setHeader("Connection","keep-alive");

        res.flushHeaders();

        res.write("data: Connected\n\n");

        const stream = await streamChat(question);


        for await(const chunk of stream){
            const content= chunk.content;

            if(!content) continue;

            const text = typeof content === "string" ?  content : JSON.stringify(content);

            res.write(`data: ${text}\n\n`)
        }

        res.write("data: [DONE]\n\n");
        res.end();

    } catch (error) {
        console.error(error);
        res.write("data: Error Occurred\n\n");
        res.end();
    }
}