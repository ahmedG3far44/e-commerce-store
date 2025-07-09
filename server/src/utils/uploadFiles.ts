import s3Client from "../configs/s3Client";
import { PutObjectCommand } from "@aws-sdk/client-s3";


const uploadFiles = async (buffer: any) => {
  try {
    console.log(buffer);
    if (buffer.length <= 1) {
      const command = new PutObjectCommand({
        Body: buffer,
        Key: `${Date.now()}`,
        Bucket: process.env.AWS_S3_BUCKET as string,
      });
      const uploadResult = await s3Client.send(command);
      if (uploadResult.$metadata.httpStatusCode !== 200) {
        throw new Error("can't upload to bucket !!!");
      }
      return { data: "uploaded file success", statusCode: 201 };
    } else {
      // uploaded multiple files
      for (const b of buffer) {
        const command = new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET as string,
          Body: b,
          Key: `${Date.now()}`,
        });
        const uploadResult = await s3Client.send(command);
        if (uploadResult.$metadata.httpStatusCode !== 200) {
          throw new Error("can't upload to bucket !!!");
        }
      }
      return { data: "uploaded multiple files success", statusCode: 201 };
    }
  } catch (err: any) {
    console.log(err?.message);
    return { data: err?.message, statusCode: 400 };
  }
};

export default uploadFiles;
