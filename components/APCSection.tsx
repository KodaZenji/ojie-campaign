import { apcSection } from "@/lib/data";

export default function APCSection() {
  return (
    <section id="apc" className="section-pad bg-green-mid">
      <div className="max-w-3xl mx-auto">

        {/* Badge */}
        <span className="inline-block bg-gold text-gold-dark text-[10px] font-bold
                         tracking-[0.2em] uppercase px-4 py-1 rounded mb-4">
          {apcSection.badge}
        </span>

        {/* Headline */}
        <h2 className="font-oswald text-white font-bold text-3xl md:text-4xl leading-tight mb-4">
          {apcSection.headline}
        </h2>

        {/* Intro paragraph */}
        <p className="text-green-muted text-base leading-relaxed mb-6">
          {apcSection.intro}
        </p>

        {/* Points */}
        <ul className="space-y-4">
          {apcSection.points.map((point, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-2 w-2 h-2 rounded-full bg-gold shrink-0" />
              <p className="text-white text-sm md:text-base leading-relaxed">{point}</p>
            </li>
          ))}
        </ul>

      </div>
    </section>
  );
}
