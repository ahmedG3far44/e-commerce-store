import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv"

dotenv.config()

export const region = process.env.AWS_S3_REGION as string
export const accessKeyId = process.env.AWS_S3_PUBLIC_KEY as string
export const secretAccessKey = process.env.AWS_S3_SECRET_ACCESS_KEY as string;

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export default s3Client;
