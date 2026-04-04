import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadFile, deleteFile } from "@/lib/s3";
import { prisma } from "@/lib/prisma";
import { uploadLimiter } from "@/lib/rate-limit";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ALLOWED_RESUME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const ALLOWED_LOGO_TYPES = ["image/png", "image/jpeg", "image/webp"];

export async function POST(req: NextRequest) {
  const rateLimited = await uploadLimiter(req);
  if (rateLimited) return rateLimited;

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const type = formData.get("type") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate upload type
    if (type !== "resume" && type !== "logo") {
      return NextResponse.json({ error: "Invalid upload type. Must be 'resume' or 'logo'" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
    }

    // Validate file type based on upload category
    if (type === "resume" && !ALLOWED_RESUME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload PDF or DOC" },
        { status: 400 }
      );
    }
    if (type === "logo" && !ALLOWED_LOGO_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload PNG, JPG, or WebP" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const folder = type === "logo" ? "logos" : "resumes";
    const { url, key } = await uploadFile(buffer, file.name, folder);

    // Update user's resume and delete old file
    if (type === "resume") {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { resumeKey: true },
      });
      if (user?.resumeKey) {
        await deleteFile(user.resumeKey).catch(() => {});
      }
      await prisma.user.update({
        where: { id: session.user.id },
        data: { resumeUrl: url, resumeKey: key },
      });
    }

    return NextResponse.json({ success: true, url, key });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
