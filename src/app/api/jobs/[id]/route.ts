import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCache, setCache, invalidateCache } from "@/lib/redis";
import { updateJobSchema } from "@/lib/validations";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { apiLimiter } from "@/lib/rate-limit";

// GET /api/jobs/:id — public
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rateLimited = await apiLimiter(req);
  if (rateLimited) return rateLimited;

  try {
    const { id } = await params;
    const cacheKey = `job:${id}`;
    const cached = await getCache(cacheKey);
    if (cached) return NextResponse.json(cached);

    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        company: {
          select: { id: true, name: true, logoUrl: true, location: true, website: true },
        },
      },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const result = {
      success: true,
      job: {
        ...job,
        company: job.company.name,
        companyId: job.company.id,
        companyLogo: job.company.logoUrl,
        companyWebsite: job.company.website,
      },
    };

    await setCache(cacheKey, result, 300);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching job:", error);
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 });
  }
}

// PUT /api/jobs/:id — employer/admin only
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rateLimited = await apiLimiter(req);
  if (rateLimited) return rateLimited;

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user.role !== "EMPLOYER" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const parsed = updateJobSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // Verify ownership (unless admin)
    if (session.user.role === "EMPLOYER") {
      const job = await prisma.job.findUnique({
        where: { id },
        include: { company: { select: { userId: true } } },
      });
      if (!job || job.company.userId !== session.user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const { deadline, ...jobData } = parsed.data;
    const updated = await prisma.job.update({
      where: { id },
      data: {
        ...jobData,
        deadline: deadline ? new Date(deadline) : undefined,
      },
    });

    await invalidateCache("jobs:*");
    await invalidateCache(`job:${id}`);

    return NextResponse.json({ success: true, job: updated });
  } catch (error) {
    console.error("Error updating job:", error);
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
  }
}

// DELETE /api/jobs/:id — employer/admin only
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rateLimited = await apiLimiter(req);
  if (rateLimited) return rateLimited;

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user.role !== "EMPLOYER" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify ownership (unless admin)
    if (session.user.role === "EMPLOYER") {
      const job = await prisma.job.findUnique({
        where: { id },
        include: { company: { select: { userId: true } } },
      });
      if (!job || job.company.userId !== session.user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    await prisma.job.delete({ where: { id } });
    await invalidateCache("jobs:*");
    await invalidateCache(`job:${id}`);

    return NextResponse.json({ success: true, message: "Job deleted" });
  } catch (error) {
    console.error("Error deleting job:", error);
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 });
  }
}

// PATCH /api/jobs/:id — toggle active status
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rateLimited = await apiLimiter(req);
  if (rateLimited) return rateLimited;

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user.role !== "EMPLOYER" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const job = await prisma.job.findUnique({
      where: { id },
      include: { company: { select: { userId: true } } },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Verify ownership (unless admin)
    if (session.user.role === "EMPLOYER" && job.company.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await prisma.job.update({
      where: { id },
      data: { isActive: !job.isActive },
    });

    await invalidateCache("jobs:*");
    await invalidateCache(`job:${id}`);

    return NextResponse.json({ success: true, job: updated });
  } catch (error) {
    console.error("Error toggling job:", error);
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
  }
}
