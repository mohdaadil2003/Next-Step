import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { apiLimiter } from "@/lib/rate-limit";

// GET /api/saved-jobs — get user's saved jobs
export async function GET(req: NextRequest) {
  const rateLimited = await apiLimiter(req);
  if (rateLimited) return rateLimited;

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const savedJobs = await prisma.savedJob.findMany({
      where: { userId: session.user.id },
      include: {
        job: {
          include: {
            company: { select: { name: true, logoUrl: true } },
          },
        },
      },
      orderBy: { savedAt: "desc" },
    });

    return NextResponse.json({ success: true, savedJobs });
  } catch (error) {
    console.error("Error fetching saved jobs:", error);
    return NextResponse.json({ error: "Failed to fetch saved jobs" }, { status: 500 });
  }
}

// POST /api/saved-jobs — save a job
export async function POST(req: NextRequest) {
  const rateLimited = await apiLimiter(req);
  if (rateLimited) return rateLimited;

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { jobId } = await req.json();
    if (!jobId) {
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
    }

    const savedJob = await prisma.savedJob.create({
      data: { userId: session.user.id, jobId },
    });

    return NextResponse.json({ success: true, savedJob }, { status: 201 });
  } catch (error) {
    console.error("Error saving job:", error);
    return NextResponse.json({ error: "Failed to save job" }, { status: 500 });
  }
}

// DELETE /api/saved-jobs — unsave a job
export async function DELETE(req: NextRequest) {
  const rateLimited = await apiLimiter(req);
  if (rateLimited) return rateLimited;

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { jobId } = await req.json();
    if (!jobId) {
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
    }

    await prisma.savedJob.delete({
      where: {
        userId_jobId: { userId: session.user.id, jobId },
      },
    });

    return NextResponse.json({ success: true, message: "Job unsaved" });
  } catch (error) {
    console.error("Error unsaving job:", error);
    return NextResponse.json({ error: "Failed to unsave job" }, { status: 500 });
  }
}
