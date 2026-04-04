import { agenda } from "@/lib/data";
import {
  GraduationCap,
  Hammer,
  ShieldCheck,
  BriefcaseBusiness,
  HeartPulse,
  Zap,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<any>> = {
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
                className="bg-white rounded-lg border border-gray-200 p-5
                         hover:border-green-main hover:shadow-sm transition-all group"
              >
                {/* Icon */}
                <div className="w-10 h-10 rounded-lg bg-green-pale flex items-center
                               justify-center mb-4 group-hover :bg-green-main transition-colors">
                  {Icon && (
                    <Icon
                      size={20}
                      className="text-green-main group-hover:text-white transition-colors"
                    />
                  )
                  }
                </div>

                {/* Title */}
                <h3 className="font-oswald font-bold text-green-main text-lg mb-2">
                  {item.title}
                </h3>

                {/* Body */}
                <p className="text-sm text-gray-600 leading-relaxed">{item.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
