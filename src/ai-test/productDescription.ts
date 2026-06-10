import { ChatMistralAI } from "@langchain/mistralai";

const model = new ChatMistralAI({
  apiKey: "KQpq9x34XSgnQf2Be8ISxmsh12sxifRD",
  model: "mistral-small-latest",
});

async function main() {
  const response = await model.invoke(
    "Write a product description for Gaming Mouse(not more than 20 words)",
  );
  console.log(response.content);
}

main();


// app.post("/stream", async (req, res) => {
//   const { message } = req.body;

//   console.log("User:", message);

//   res.setHeader("Content-Type", "text/event-stream");
//   res.setHeader("Cache-Control", "no-cache");
//   res.setHeader("Connection", "keep-alive");

//   const chunks = [
//     "Hello ",
//     "Bro! ",
//     "You said: ",
//     `"${message}" `,
//     "This is ",
//     "a streamed ",
//     "response."
//   ];

//   for (const chunk of chunks) {
//     res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);

//     await new Promise((resolve) => setTimeout(resolve, 500));
//   }

//   res.write("data: [DONE]\n\n");
//   res.end();
// });