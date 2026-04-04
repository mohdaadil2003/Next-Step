"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Menu, X, Briefcase, BookOpen, Users, ShieldCheck,
  MessageCircle, LogIn, LogOut, User, Building2,
} from "lucide-react";

const publicLinks = [
  { href: "/", label: "Jobs", icon: Briefcase },
  { href: "/resources", label: "Resources", icon: BookOpen },
  { href: "/consulting", label: "Consulting", icon: Users },
];

interface NavbarProps {
  onOpenWhatsApp?: () => void;
}

export default function Navbar({ onOpenWhatsApp }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 10);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navLinks = [
    ...publicLinks,
    ...(session?.user?.role === "ADMIN"
      ? [{ href: "/admin", label: "Admin", icon: ShieldCheck }]
      : []),
    ...(session?.user?.role === "EMPLOYER"
      ? [{ href: "/employer/dashboard", label: "Dashboard", icon: Building2 }]
      : []),
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-xl ${
        scrolled
          ? "bg-white/90 shadow-[0_1px_20px_rgba(10,102,194,0.08)]"
          : "bg-white/70"
      }`}
      style={{ height: 68 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold"
            style={{ background: "linear-gradient(135deg, #0A66C2, #00AAFF)" }}
          >
            NS
          </div>
          <span
            className="text-xl font-bold bg-clip-text text-transparent"
            style={{
              backgroundImage: "linear-gradient(135deg, #0A66C2, #00AAFF)",
              fontFamily: "var(--font-display)",
            }}
          >
            NEXT STEP
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/"
                ? pathname === "/"
                : pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? "text-[#0A66C2] bg-[#E8F0FE]"
                    : "text-[#4A5A70] hover:text-[#0A66C2] hover:bg-[#E8F0FE]/50"
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}

          {/* Auth buttons */}
          {session ? (
            <div className="flex items-center gap-2 ml-2">
              <Link
                href={session.user.role === "EMPLOYER" ? "/employer/dashboard" : "/dashboard"}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-[#4A5A70] hover:text-[#0A66C2] hover:bg-[#E8F0FE]/50 transition-all"
              >
                <User size={16} />
                {session.user.name?.split(" ")[0] || "Profile"}
              </Link>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-[#4A5A70] hover:text-red-600 hover:bg-red-50 transition-all"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link
              href="/auth/signin"
              className="flex items-center gap-1.5 ml-2 px-4 py-2 rounded-xl text-sm font-medium text-[#4A5A70] hover:text-[#0A66C2] hover:bg-[#E8F0FE]/50 transition-all"
            >
              <LogIn size={16} />
              Sign In
            </Link>
          )}

          <button
            onClick={onOpenWhatsApp}
            className="flex items-center gap-1.5 ml-2 px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            style={{ background: "linear-gradient(135deg, #0A66C2, #00AAFF)" }}
          >
            <MessageCircle size={16} />
            Contact Us
          </button>
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden p-2 rounded-xl text-[#4A5A70] hover:bg-[#E8F0FE] transition"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-[#D4E0F0] shadow-xl transition-all duration-300 overflow-hidden ${
          mobileOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-3 space-y-1">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? "text-[#0A66C2] bg-[#E8F0FE]"
                    : "text-[#4A5A70] hover:text-[#0A66C2] hover:bg-[#E8F0FE]/50"
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
          {session ? (
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          ) : (
            <Link
              href="/auth/signin"
              className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-medium text-[#4A5A70] hover:text-[#0A66C2] hover:bg-[#E8F0FE]/50 transition-all"
            >
              <LogIn size={18} />
              Sign In
            </Link>
          )}
          <button
            onClick={() => {
              setMobileOpen(false);
              onOpenWhatsApp?.();
            }}
            className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-semibold text-white transition-all"
            style={{ background: "linear-gradient(135deg, #0A66C2, #00AAFF)" }}
          >
            <MessageCircle size={18} />
            Contact Us
          </button>
        </div>
      </div>
    </nav>
  );
}
