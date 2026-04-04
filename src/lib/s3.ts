import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

// Lazy-init: prevents crash on import if AWS env vars are missing
let _s3: S3Client | null = null;

function getS3Client(): S3Client {
  if (!_s3) {
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      throw new Error("AWS S3 credentials are not configured (AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY)");
    }
    _s3 = new S3Client({
      region: process.env.AWS_REGION || "ap-south-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }
  return _s3;
}

function getBucket(): string {
  if (!process.env.AWS_S3_BUCKET) {
    throw new Error("AWS_S3_BUCKET environment variable is not set");
  }
  return process.env.AWS_S3_BUCKET;
}

const ALLOWED_EXTENSIONS = ["pdf", "doc", "docx", "png", "jpg", "jpeg", "webp"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function uploadFile(
  file: Buffer,
  originalName: string,
  folder: string = "resumes"
): Promise<{ url: string; key: string }> {
  const ext = (originalName.split(".").pop() || "").toLowerCase();

  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    throw new Error(`File type .${ext} is not allowed`);
  }
  if (file.length > MAX_FILE_SIZE) {
    throw new Error("File exceeds 10MB limit");
  }

  const bucket = getBucket();
  const key = `${folder}/${uuidv4()}.${ext}`;

  await getS3Client().send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file,
      ContentType: getContentType(ext),
      ServerSideEncryption: "AES256",
    })
  );

  const url = `https://${bucket}.s3.${process.env.AWS_REGION || "ap-south-1"}.amazonaws.com/${key}`;
  return { url, key };
}

export async function deleteFile(key: string): Promise<void> {
  await getS3Client().send(
    new DeleteObjectCommand({
      Bucket: getBucket(),
      Key: key,
    })
  );
}

export async function getPresignedUrl(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  return getSignedUrl(
    getS3Client(),
    new GetObjectCommand({ Bucket: getBucket(), Key: key }),
    { expiresIn }
  );
}

function getContentType(ext: string): string {
  const types: Record<string, string> = {
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    webp: "image/webp",
  };
  return types[ext.toLowerCase()] || "application/octet-stream";
}
