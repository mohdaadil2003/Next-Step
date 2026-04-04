import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/resources`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/consulting`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/auth/signin`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/auth/register`, changeFrequency: "yearly", priority: 0.3 },
  ];

  // Dynamic job pages
  let jobPages: MetadataRoute.Sitemap = [];
  try {
    const jobs = await prisma.job.findMany({
      where: { isActive: true },
      select: { id: true, updatedAt: true },
      orderBy: { createdAt: "desc" },
      take: 1000,
    });

    jobPages = jobs.map((job) => ({
      url: `${baseUrl}/jobs/${job.id}`,
      lastModified: job.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }));
  } catch {
    // If DB is unreachable, return static pages only
  }

  return [...staticPages, ...jobPages];
}
