import { z } from "zod";

// ─── Auth Schemas ─────────────────────────────────────────────

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
  role: z.enum(["JOB_SEEKER", "EMPLOYER"]),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// ─── Job Schemas ──────────────────────────────────────────────

export const createJobSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().optional(),
  type: z.string().optional(),
  salary: z.string().optional(),
  location: z.string().optional(),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}(T.*)?$/, "Must be a valid date").optional().or(z.literal("")),
  experience: z.string().optional(),
  requirements: z.array(z.string()).optional(),
  applyLink: z.string().url("Invalid URL").optional().or(z.literal("")),
  isUrgent: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

export const updateJobSchema = createJobSchema.partial();

// ─── Application Schema ──────────────────────────────────────

export const applyJobSchema = z.object({
  jobId: z.string().min(1),
  coverLetter: z.string().max(2000).optional(),
});

// ─── Contact Schema ───────────────────────────────────────────

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email(),
  message: z.string().trim().min(10).max(2000),
  jobId: z.string().optional(),
});

// ─── Newsletter Schema ───────────────────────────────────────

export const newsletterSchema = z.object({
  email: z.string().trim().toLowerCase().email("Please enter a valid email address"),
});

// ─── Company Profile Schema ──────────────────────────────────

export const companyProfileSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().max(2000).optional(),
  website: z.string().url().optional().or(z.literal("")),
  location: z.string().optional(),
  industry: z.string().optional(),
  size: z.string().optional(),
});

// Type exports
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;
export type ApplyJobInput = z.infer<typeof applyJobSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type CompanyProfileInput = z.infer<typeof companyProfileSchema>;
