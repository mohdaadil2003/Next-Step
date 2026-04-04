import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Career Consulting",
  description:
    "Get expert career guidance — resume reviews, mock interviews, LinkedIn optimization, and salary negotiation help for fresh graduates in India.",
  openGraph: {
    title: "Career Consulting | NEXT STEP",
    description:
      "Expert career guidance for fresh graduates — resume reviews, mock interviews, and more.",
  },
};

export default function ConsultingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
