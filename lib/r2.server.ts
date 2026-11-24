// We dont need to import "server-only" here because this will throw outside Next, 
// and the sheets import script uploads through this client
import { S3Client } from "@aws-sdk/client-s3";

export const S3_IMAGES_BUCKET = "images";
export const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.S3_API_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
});
