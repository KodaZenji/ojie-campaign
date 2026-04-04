import Image from "next/image";
import { hero, candidate } from "@/lib/data";
import WhatsAppIcon from "./icons/WhatsAppIcon";

export default function Hero() {
  const waUrl = `https://wa.me/${candidate.whatsappNumber}?text=${encodeURIComponent(
    candidate.whatsappMessage
  )}`;

  return (
    <section className="bg-green-main text-center px-5 pt-16 pb-14">

      {/* Photo or initials avatar */}
      <div className="w-36 h-36 rounded-full border-4 border-gold mx-auto mb-6 overflow-hidden
                      bg-green-mid flex items-center justify-content-center">
        {candidate.photo ? (
          <Image
            src={candidate.photo}
            alt={candidate.name}
            width={144}
            height={144}
            className="w-full h-full object-cover"
            priority
          />
        ) : (
          <span className="font-oswald text-4xl font-bold text-gold w-full h-full
                           flex items-center justify-center">
            {candidate.initials}
          </span>
        )}
      </div>

      {/* Party / constituency line */}
      <p className="text-green-muted text-[11px] tracking-[0.22em] font-semibold uppercase mb-3">
        {hero.partyLine}
      </p>

      {/* Name */}
      <h1 className="font-oswald font-bold text-white text-4xl md:text-5xl leading-tight
                     tracking-wide mb-6">
        {candidate.name.toUpperCase()}
      </h1>

      {/* Tagline with gold borders */}
      <div className="inline-block border-t-2 border-b-2 border-gold px-5 py-3 mb-8">
        <span className="font-oswald text-white text-lg md:text-xl font-medium tracking-[0.2em]">
          {candidate.tagline.toUpperCase()}
        </span>
      </div>

      {/* CTA buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        <a href={hero.cta1Href} className="btn-gold">
          {hero.cta1Label}
        </a>
        <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn-wa">
          <WhatsAppIcon size={18} />
          {hero.cta2Label}
        </a>
      </div>

    </section>
  );
}
