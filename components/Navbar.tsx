"use client";
import { navbar, candidate } from "@/lib/data";
import WhatsAppIcon from "./icons/WhatsAppIcon";

export default function Navbar() {
  const waUrl = `https://wa.me/${candidate.whatsappNumber}?text=${encodeURIComponent(
    candidate.whatsappMessage
  )}`;

  return (
    <nav className="sticky top-0 z-50 bg-green-main shadow-lg">
      <div className="max-w-5xl mx-auto px-5 py-3 flex items-center justify-between gap-3">

        {/* Logo */}
        <span className="font-oswald font-bold text-white tracking-widest text-sm md:text-base shrink-0">
          {navbar.logo}
        </span>

        {/* Party badge — hidden on very small screens */}
        <span className="hidden sm:inline bg-gold text-gold-dark text-[10px] font-bold
                         tracking-[0.18em] px-3 py-1 rounded shrink-0">
          {navbar.badge}
        </span>

        {/* WhatsApp CTA */}
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-wa text-sm py-2 px-4 shrink-0"
        >
          <WhatsAppIcon size={14} />
          <span className="hidden sm:inline">{navbar.ctaLabel}</span>
          <span className="sm:hidden">WhatsApp</span>
        </a>

      </div>
    </nav>
  );
}
