import s3Client from "../configs/s3Client";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";


const BUCKET_NAME = process.env.AWS_S3_BUCKET as string;

export const uploadFiles = async (buffer: any) => {
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

export const uploadToS3 = async (file: Express.Multer.File): Promise<string> => {
  const fileExtension = file.originalname.split('.').pop();
  const fileName = `categories/${crypto.randomUUID()}.${fileExtension}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET ,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  await s3Client.send(command);

  return `https://${BUCKET_NAME}.s3.amazonaws.com/${fileName}`;

};

export const deleteFromS3 = async (imageUrl: string): Promise<void> => {
  try {
    // Extract the key from the URL
    const key = imageUrl.split('.com/')[1];

    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key
    });

    await s3Client.send(command);
  } catch (error) {
    console.error('S3 delete error:', error);
    // Don't throw error, just log it
  }
};
