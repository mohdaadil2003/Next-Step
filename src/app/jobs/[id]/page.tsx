import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import JobDetail from "@/components/jobs/JobDetail";
import type { JobDetailData } from "@/components/jobs/JobDetail";

interface Props {
  params: Promise<{ id: string }>;
}

async function getJob(id: string): Promise<JobDetailData | null> {
  try {
    const job = await prisma.job.findUnique({
      where: { id },
      include: { company: { select: { name: true, website: true } } },
    });

    if (!job) return null;

    return {
      id: job.id,
      title: job.title,
      company: job.company?.name || "Unknown Company",
      location: job.location || "",
      type: job.type || "",
      experience: job.experience || "",
      salary: job.salary || "",
      description: job.description || "",
      category: job.category || "",
      deadline: job.deadline?.toISOString() || "",
      createdAt: job.createdAt?.toISOString() || "",
      isActive: job.isActive,
      requirements: (job.requirements as string[]) || [],
      applyLink: job.applyLink || null,
      companyWebsite: job.company?.website || null,
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const job = await getJob(id);

  if (!job) {
    return { title: "Job Not Found" };
  }

  const description = `${job.title} at ${job.company}${job.location ? ` in ${job.location}` : ""}${job.type ? ` — ${job.type}` : ""}. Apply now on NEXT STEP.`;

  return {
    title: `${job.title} at ${job.company}`,
    description,
    openGraph: {
      title: `${job.title} at ${job.company}`,
      description,
      type: "website",
    },
  };
}

export default async function JobDetailPage({ params }: Props) {
  const { id } = await params;
  const job = await getJob(id);

  if (!job) {
    notFound();
  }

  // JSON-LD structured data for job posting
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.createdAt,
    ...(job.deadline && { validThrough: job.deadline }),
    hiringOrganization: {
      "@type": "Organization",
      name: job.company,
    },
    ...(job.location && {
      jobLocation: {
        "@type": "Place",
        address: {
          "@type": "PostalAddress",
          addressLocality: job.location,
          addressCountry: "IN",
        },
      },
    }),
    ...(job.type && { employmentType: job.type.toUpperCase().replace(" ", "_") }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <JobDetail job={job} />
    </>
  );
}
