import { S3Client } from "@aws-sdk/client-s3";

const region = process.env.AWS_S3_REGION as string;
const accessKeyId = process.env.AWS_S3_PUBLIC_KEY as string;
const secretAccessKey = process.env.AWS_S3_SECRET_ACCESS_KEY as string;

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export default s3Client;
