import { Request, Response } from "express";
import fs from "fs";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { embeddings } from "../../lib/embedding";
import prisma from "../../lib/prisma";

export async function ragChat(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Read PDF
    const loader = new PDFLoader(req.file.path);
    const docs = await loader.load();
    // console.log(docs)

    // Text Splitter
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const splitDocs = await splitter.splitDocuments(docs);
    // console.log(splitDocs.length);
    // console.log(splitDocs[0]);

    // Generate Embedding
    const vectors = await embeddings.embedDocuments(
      splitDocs.map((doc) => doc.pageContent),
    );
    console.log(vectors.length);
    console.log(vectors[0].length);

  
    for (let i = 0; i < splitDocs.length; i++) {
      const vector = `[${vectors[i].join(",")}]`;

      await prisma.$executeRaw`
    INSERT INTO "DocumentChunk"
    ("id","documentName","chunk","embedding")
    VALUES
    (   ${i},
        ${req.file.originalname},
        ${splitDocs[i].pageContent},
        ${vector}::vector
    )
`;
    }

    return res.json({
      success: true,
      pages: docs.length,
      //   docs,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}
