import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import AppShell from "@/components/layout/AppShell";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
});

// Outfit — a geometric, modern display font (free Google Font)
// Replaces Clash Display which required self-hosting
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  title: {
    default: "NEXT STEP — Career Portal for Fresh Graduates",
    template: "%s | NEXT STEP",
  },
  description:
    "India's trusted career platform for fresh graduates. Discover curated job opportunities, internships & career resources. No experience needed — just ambition.",
  keywords: [
    "fresher jobs", "entry level jobs india", "graduate jobs",
    "internship", "career portal", "next step",
  ],
  robots: { index: true, follow: true },
  openGraph: {
    title: "NEXT STEP — Your Dream Career Starts Here",
    description: "Curated jobs & resources for fresh graduates in India.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased ${jakarta.variable} ${outfit.variable}`}>
      <body className="min-h-full flex flex-col">
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
