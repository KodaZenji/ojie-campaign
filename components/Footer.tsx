import { footer, candidate } from "@/lib/data";
import WhatsAppIcon from "./icons/WhatsAppIcon";

export default function Footer() {
  return (
    <footer className="bg-green-dark text-center px-5 py-8">

      {/* Share nudge bar */}
      <div className="flex items-center justify-center gap-2 bg-wa text-white
                      text-sm font-semibold px-5 py-3 rounded-lg mb-6 max-w-md mx-auto">
        <WhatsAppIcon size={16} />
        <span>Share this link in your WhatsApp groups to help spread the word!</span>
      </div>

      {/* Footer lines */}
      <p className="text-[11px] text-green-light tracking-wide mb-1">{footer.line1}</p>
      
      <p className="text-[10px] text-green-light opacity-60 mt-3">{footer.line3}</p>

    </footer>
  );
}
