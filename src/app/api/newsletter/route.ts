import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { newsletterSchema } from "@/lib/validations";
import { apiLimiter } from "@/lib/rate-limit";

// POST /api/newsletter — subscribe
export async function POST(req: NextRequest) {
  const rateLimited = await apiLimiter(req);
  if (rateLimited) return rateLimited;

  try {
    const body = await req.json();
    const parsed = newsletterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: parsed.data.email },
    });

    if (existing) {
      if (existing.isActive) {
        // Return success to prevent email enumeration
        return NextResponse.json({ success: true, message: "Subscribed successfully!" });
      }
      // Re-activate
      await prisma.newsletterSubscriber.update({
        where: { email: parsed.data.email },
        data: { isActive: true },
      });
      return NextResponse.json({ success: true, message: "Re-subscribed successfully" });
    }

    await prisma.newsletterSubscriber.create({
      data: { email: parsed.data.email },
    });

    return NextResponse.json(
      { success: true, message: "Subscribed successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Newsletter error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}
