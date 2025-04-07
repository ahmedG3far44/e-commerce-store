import express from "express";
import upload from "../configs/multer"; // Adjust the path to your Multer middleware
import s3Client from "../configs/s3Client";
import { Buffer } from "buffer";
import { ExtendedRequest } from "../utils/types";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";

const Bucket = process.env.AWS_S3_BUCKET as string;
const router = express.Router();

export interface File {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}
router.post(
  "/",
  upload.array("image", 5),
  async (req: ExtendedRequest, res) => {
    try {
      const files: File[] = req.files as File[];

      if (!files) {
        throw new Error("there is no files to upload!!");
      }

      let imagesUrl: any[] = [];
      files?.map(async (file) => {
        const fileKey = `${crypto.randomUUID()}}` ;

        imagesUrl.push(`${process.env.AWS_S3_BUCKET_DOMAIN}/${fileKey}`);

        const command = new PutObjectCommand({
          Bucket,
          Key: fileKey,
          Body: file.buffer,
          ContentType: file.mimetype,
        });

        const result = await s3Client.send(command);

        if (result.$metadata.httpStatusCode !== 200) {
          throw new Error("can't upload files to S3!!");
        }
      });

      res.status(201).json({ images: imagesUrl });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
);

export default router;
