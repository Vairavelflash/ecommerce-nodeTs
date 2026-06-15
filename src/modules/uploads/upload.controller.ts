import { Request, Response } from "express";
import { deleteFileFromS3, generatePresignedUrl } from "./upload.service";



export const getPresignedUrl = async(req:Request,res:Response) =>{
  try {
    const {fileName,contentType} = req.body;

    const result = await generatePresignedUrl(fileName,contentType);

    return res.status(200).json(result)
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to generate URL",
    });
  }
}

export const deleteFile = async(req:Request,res:Response) =>{
 try {
    const { key } = req.body;

    await deleteFileFromS3(key);

    return res.status(200).json({
      message: "File deleted",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Delete failed",
    });
  }
}