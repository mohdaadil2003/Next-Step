"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Phone, Mail, MessageCircle } from "lucide-react";
import { WHATSAPP_NUMBER, CALL_NUMBER, EMAIL } from "@/lib/constants";
import { buildWhatsAppUrl } from "@/lib/helpers";

const SERVICES = [
  { icon: "\uD83D\uDCC4", title: "Resume Review", description: "Get expert feedback on your resume with actionable suggestions to make it ATS-friendly and recruiter-approved.", price: "Free" },
  { icon: "\uD83C\uDFAF", title: "Mock Interview", description: "Practice with real interview questions. Get feedback on your answers, body language, and confidence.", price: "\u20B9499" },
  { icon: "\uD83D\uDD17", title: "LinkedIn Optimization", description: "Transform your LinkedIn profile to attract recruiters and stand out in your industry.", price: "\u20B9299" },
  { icon: "\uD83D\uDCBC", title: "Career Roadmap", description: "Get a personalized career plan based on your skills, interests, and market demand.", price: "\u20B9999" },
  { icon: "\uD83D\uDCE3", title: "Job Search Strategy", description: "Learn where to find hidden jobs, how to network effectively, and how to follow up professionally.", price: "Free" },
  { icon: "\uD83D\uDCB0", title: "Salary Negotiation", description: "Know your worth and learn proven techniques to negotiate a better compensation package.", price: "\u20B9499" },
];

const FAQ = [
  { q: "How do I book a consulting session?", a: "Simply click \"Book via WhatsApp\" and send us a message. Our team will schedule a session at your convenience." },
  { q: "Is the resume review really free?", a: "Yes! We offer one free resume review per student. Our experts will provide detailed feedback within 48 hours." },
  { q: "How long is a mock interview session?", a: "Each mock interview session lasts 30-45 minutes, including feedback and tips for improvement." },
  { q: "Can I get a refund if I'm not satisfied?", a: "Absolutely. We offer a full refund within 7 days if you're not satisfied with the service." },
  { q: "Do you offer group discounts?", a: "Yes! Contact us for special pricing for college groups of 10+ students." },
];

export default function ConsultingPage() {
  const [openFaq, setOpenFaq] = useState(-1);

  const handleBookWhatsApp = (service: string) => {
    const msg = `Hi! I'm interested in the "${service}" consulting service from NEXT STEP. Could you share more details?`;
    window.open(buildWhatsAppUrl(WHATSAPP_NUMBER, msg), "_blank", "noopener");
  };

  return (
    <div className="pt-[68px] pb-16 animate-fade-up">
      {/* Hero */}
      <section className="py-20 px-4" style={{ background: "linear-gradient(135deg, #004182, #0A66C2)" }}>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-display)" }}>Career Consulting</h1>
          <p className="text-white/75 text-lg max-w-2xl mx-auto mb-8">Expert guidance to accelerate your career journey. From resume building to salary negotiation — we&apos;ve got you covered.</p>
          <button onClick={() => handleBookWhatsApp("Career Consulting")} className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all" style={{ background: "#25D366" }}>
            Book a Free Call
          </button>
        </div>
      </section>

      {/* Services */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-3" style={{ fontFamily: "var(--font-display)" }}>Our Services</h2>
        <p className="text-muted text-center mb-10">Choose the support you need to land your dream role</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((s) => (
            <div key={s.title} className="bg-white rounded-2xl border border-border/50 p-6 hover:-translate-y-1 hover:shadow-md transition-all group">
              <div className="text-3xl mb-4">{s.icon}</div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-text">{s.title}</h3>
                <span className={`text-sm font-bold ${s.price === "Free" ? "text-green-600" : "text-primary"}`}>{s.price}</span>
              </div>
              <p className="text-sm text-muted leading-relaxed mb-4">{s.description}</p>
              <button onClick={() => handleBookWhatsApp(s.title)} className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all">
                Book via WhatsApp
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>Get in Touch</h2>
          <p className="text-muted mb-8">Reach out to us through any of these channels</p>
          <div className="flex flex-wrap justify-center gap-6">
            <a href={`tel:${CALL_NUMBER}`} className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl border border-border/50 hover:border-primary hover:shadow-md transition-all">
              <Phone size={20} className="text-primary" />
              <div className="text-left"><p className="text-xs text-muted">Call us</p><p className="font-semibold text-text">{CALL_NUMBER}</p></div>
            </a>
            <a href={`mailto:${EMAIL}`} className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl border border-border/50 hover:border-primary hover:shadow-md transition-all">
              <Mail size={20} className="text-primary" />
              <div className="text-left"><p className="text-xs text-muted">Email us</p><p className="font-semibold text-text">{EMAIL}</p></div>
            </a>
            <button onClick={() => handleBookWhatsApp("General Inquiry")} className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl border border-border/50 hover:border-[#25D366] hover:shadow-md transition-all">
              <MessageCircle size={20} style={{ color: "#25D366" }} />
              <div className="text-left"><p className="text-xs text-muted">WhatsApp</p><p className="font-semibold text-text">+91 8506880786</p></div>
            </button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-3" style={{ fontFamily: "var(--font-display)" }}>Frequently Asked Questions</h2>
        <p className="text-muted text-center mb-8">Got questions? We&apos;ve got answers.</p>
        <div className="space-y-3">
          {FAQ.map((item, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-border/50 overflow-hidden">
              <button onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)} className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition">
                <span className="font-semibold text-text pr-4">{item.q}</span>
                {openFaq === idx ? <ChevronUp size={18} className="text-muted flex-shrink-0" /> : <ChevronDown size={18} className="text-muted flex-shrink-0" />}
              </button>
              {openFaq === idx && <div className="px-4 pb-4"><p className="text-sm text-muted leading-relaxed">{item.a}</p></div>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
