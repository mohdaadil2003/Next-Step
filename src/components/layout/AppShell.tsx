"use client";

import { useState, type ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollProgress from "./ScrollProgress";
import WhatsAppModal from "../ui/WhatsAppModal";

export default function AppShell({ children }: { children: ReactNode }) {
  const [waOpen, setWaOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#F0F4FA] font-body text-[#0F1B2D]">
      <ScrollProgress />
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Navbar onOpenWhatsApp={() => setWaOpen(true)} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
      <WhatsAppModal isOpen={waOpen} onClose={() => setWaOpen(false)} />
    </div>
  );
}
