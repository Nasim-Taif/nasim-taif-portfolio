import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

let client: S3Client | undefined;

function storage() {
  const endpoint = process.env.S3_ENDPOINT;
  const region = process.env.S3_REGION ?? "auto";
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
  if (!endpoint || !accessKeyId || !secretAccessKey || !process.env.S3_BUCKET) {
    throw new Error("S3 storage is not configured.");
  }
  client ??= new S3Client({ endpoint, region, credentials: { accessKeyId, secretAccessKey } });
  return client;
}

export async function uploadImage(key: string, body: Uint8Array, contentType: string) {
  await storage().send(new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    Body: body,
    ContentType: contentType,
  }));
}

export async function downloadImage(key: string) {
  return storage().send(new GetObjectCommand({ Bucket: process.env.S3_BUCKET, Key: key }));
}
