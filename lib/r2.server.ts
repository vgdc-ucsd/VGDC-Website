// We dont need to import "server-only" here because this will throw outside Next, 
// and the sheets import script uploads through this client
import { S3Client } from "@aws-sdk/client-s3";

export const S3_IMAGES_BUCKET = "images";
export const s3 = new S3Client({
  // R2 ignores the region, but local Garage rejects signatures for anything but its own
  region: process.env.S3_REGION || "auto",
  endpoint: process.env.S3_API_ENDPOINT!,
  // localhost can't take bucket subdomains, so local Garage needs path-style URLs. R2 accepts both
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
});
