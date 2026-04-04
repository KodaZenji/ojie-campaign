import { press } from "@/lib/data";

export default function PressGrid() {
  return (
    <section id="press" className="section-pad bg-white">
      <div className="max-w-5xl mx-auto">
        <p className="eyebrow">Media Coverage</p>
        <h2 className="section-title">As Covered By</h2>
        <div className="green-rule" />

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {press.map((outlet) => (
            <a
              key={outlet.name}
              href={outlet.url}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gray-200 rounded-lg p-4 hover:border-green-main
                         hover:shadow-sm transition-all group"
            >
              <p className="font-oswald font-semibold text-gray-900 text-sm
                            group-hover:text-green-main transition-colors">
                {outlet.name}
              </p>
              <p className="text-xs text-gray-400 mt-1">{outlet.topic}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
