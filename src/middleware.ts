import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Admin routes — ADMIN only
    if (pathname.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Employer routes — EMPLOYER only
    if (pathname.startsWith("/employer") && token?.role !== "EMPLOYER") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Job seeker dashboard — JOB_SEEKER only
    if (pathname === "/dashboard" && token?.role !== "JOB_SEEKER") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Return true to allow the middleware function to run
      // Return false to redirect to the sign-in page
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/auth/signin",
    },
  }
);

export const config = {
  matcher: ["/dashboard", "/admin/:path*", "/employer/:path*"],
};
