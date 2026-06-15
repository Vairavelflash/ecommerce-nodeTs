import { Router } from "express";
import { getPresignedUrl,deleteFile } from "./upload.controller";


const router = Router();


router.post(
  "/presigned-url",
  getPresignedUrl
);

router.delete("/", deleteFile);

export default router;