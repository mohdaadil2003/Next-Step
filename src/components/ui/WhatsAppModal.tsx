"use client";

import { useState, useEffect, useRef } from "react";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { buildWhatsAppUrl } from "@/lib/helpers";

const DEFAULT_MESSAGE =
  "Hi! I found NEXT STEP and would like to know more about career opportunities. Please guide me.";

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string;
}

export default function WhatsAppModal({ isOpen, onClose, initialMessage }: WhatsAppModalProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setMessage(initialMessage || DEFAULT_MESSAGE);
      setTimeout(() => textareaRef.current?.focus(), 100);
      // Lock body scroll
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen, initialMessage]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      // Focus trap
      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, textarea, [href], input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSend = () => {
    const url = buildWhatsAppUrl(WHATSAPP_NUMBER, message);
    window.open(url, "_blank", "noopener");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Chat with us on WhatsApp">
      <div className="absolute inset-0 bg-black/50 animate-fade-in" onClick={onClose} />
      <div ref={modalRef} className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-7 animate-slide-down">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span style={{ color: "#25D366" }}>&#9742;</span> Chat with Us
          </h2>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-muted hover:bg-gray-200 transition" aria-label="Close">
            &#10005;
          </button>
        </div>
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          rows={4}
          className="w-full px-4 py-3 rounded-xl border-2 border-border bg-white text-text placeholder:text-muted/60 focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/20 transition-all outline-none resize-none"
        />
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 px-5 py-2.5 rounded-xl font-semibold border-2 border-border text-muted hover:bg-gray-50 transition">
            Cancel
          </button>
          <button onClick={handleSend} className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white transition hover:-translate-y-0.5" style={{ background: "#25D366" }}>
            Send on WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
