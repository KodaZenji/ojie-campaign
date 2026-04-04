"use client";
import { candidate } from "@/lib/data";
import WhatsAppIcon from "./icons/WhatsAppIcon";

export default function FloatingWhatsApp() {
  const waUrl = `https://wa.me/${candidate.whatsappNumber}?text=${encodeURIComponent(
    candidate.whatsappMessage
  )}`;

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-5 z-50 flex items-center gap-2
                 bg-wa text-white font-oswald font-bold text-sm tracking-wide
                 px-4 py-3 rounded-full shadow-lg
                 hover:brightness-110 active:scale-95 transition-all"
    >
      <WhatsAppIcon size={20} />
      <span className="hidden sm:inline">WhatsApp Us</span>
    </a>
  );
}
