import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCache, setCache, invalidateCache } from "@/lib/redis";
import { createJobSchema } from "@/lib/validations";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { apiLimiter } from "@/lib/rate-limit";
import { Prisma } from "@prisma/client";

// GET /api/jobs — public, cached
export async function GET(req: NextRequest) {
  const rateLimited = await apiLimiter(req);
  if (rateLimited) return rateLimited;

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const type = searchParams.get("type") || "";
    const location = searchParams.get("location") || "";
    const sort = searchParams.get("sort") || "latest";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));

    // Try cache
    const cacheKey = `jobs:${search}:${category}:${type}:${location}:${sort}:${page}:${limit}`;
    const cached = await getCache(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    // Build where clause
    const where: Prisma.JobWhereInput = {};
    const mine = searchParams.get("mine") === "true";

    if (mine) {
      const session = await getServerSession(authOptions);
      if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const company = await prisma.company.findUnique({
        where: { userId: session.user.id },
        select: { id: true },
      });
      if (!company) {
        return NextResponse.json({ success: true, data: [], pagination: { total: 0, page: 1, limit, totalPages: 0 } });
      }
      where.companyId = company.id;
    } else {
      where.isActive = true;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { company: { is: { name: { contains: search, mode: "insensitive" } } } },
      ];
    }
    if (category) where.category = category;
    if (type) where.type = type;
    if (location) {
      where.location = { contains: location, mode: "insensitive" };
    }

    // Build sort
    let orderBy: Prisma.JobOrderByWithRelationInput = { createdAt: "desc" };
    if (sort === "deadline") orderBy = { deadline: "asc" };
    if (sort === "oldest") orderBy = { createdAt: "asc" };
    if (sort === "salary") orderBy = { salary: "desc" };

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          company: {
            select: { id: true, name: true, logoUrl: true, location: true },
          },
        },
      }),
      prisma.job.count({ where }),
    ]);

    // Flatten company name for frontend compatibility
    const data = jobs.map((job) => ({
      ...job,
      company: job.company.name,
      companyId: job.company.id,
      companyLogo: job.company.logoUrl,
      companyLocation: job.company.location,
    }));

    const result = {
      success: true,
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    await setCache(cacheKey, result, 120); // 2 min cache
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

// POST /api/jobs — employer only
export async function POST(req: NextRequest) {
  const rateLimited = await apiLimiter(req);
  if (rateLimited) return rateLimited;

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user.role !== "EMPLOYER" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createJobSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // Get employer's company
    const company = await prisma.company.findUnique({
      where: { userId: session.user.id },
    });

    if (!company) {
      return NextResponse.json(
        { error: "Please set up your company profile first" },
        { status: 400 }
      );
    }

    const { deadline, ...jobData } = parsed.data;
    const job = await prisma.job.create({
      data: {
        ...jobData,
        deadline: deadline ? new Date(deadline) : null,
        companyId: company.id,
      },
      include: {
        company: { select: { id: true, name: true } },
      },
    });

    await invalidateCache("jobs:*");

    return NextResponse.json({ success: true, job }, { status: 201 });
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 }
    );
  }
}
