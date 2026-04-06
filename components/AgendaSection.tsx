import Image from "next/image";
import { agenda } from "@/lib/data";
import {
  GraduationCap,
  Hammer,
  ShieldCheck,
  BriefcaseBusiness,
  HeartPulse,
  Zap,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  GraduationCap,
  Hammer,
  ShieldCheck,
  BriefcaseBusiness,
  HeartPulse,
  Zap,
};

export default function AgendaSection() {
  return (
    <section id="agenda" className="section-pad bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <p className="eyebrow">{agenda.eyebrow}</p>
        <h2 className="section-title">{agenda.headline}</h2>
        <div className="green-rule" />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {agenda.items.map((item) => {
            const Icon = iconMap[item.icon];
            return (
              <div
                key={item.title}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden
                           hover:border-green-main hover:shadow-sm transition-all group"
              >
                {/* Image OR icon block */}
                {item.image ? (
                  <div className="relative w-full h-40">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {/* Dark overlay with icon on top of image */}
                    <div className="absolute inset-0 bg-green-dark/40 flex items-center
                                    justify-center opacity-0 group-hover:opacity-100
                                    transition-opacity duration-300">
                      {Icon && <Icon size={32} className="text-white" />}
                    </div>
                  </div>
                ) : (
                  /* No image — show icon block */
                  <div className="w-full h-24 bg-green-pale flex items-center justify-center
                                  group-hover:bg-green-main transition-colors duration-300">
                    {Icon && (
                      <Icon
                        size={32}
                        className="text-green-main group-hover:text-white transition-colors duration-300"
                      />
                    )}
                  </div>
                )}

                {/* Text content */}
                <div className="p-5">
                  <h3 className="font-oswald font-bold text-green-main text-lg mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.body}
                  </p>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
