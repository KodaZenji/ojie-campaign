import { stats } from "@/lib/data";

export default function StatsBar() {
  return (
    <div
      className="grid bg-gold"
      style={{ gridTemplateColumns: `repeat(${stats.length}, 1fr)`, gap: "1px" }}
    >
      {stats.map((s) => (
        <div key={s.label} className="bg-green-mid text-center px-3 py-4">
          <div className="font-oswald text-gold text-2xl font-bold">{s.value}</div>
          <div className="text-green-muted text-[10px] tracking-[0.15em] uppercase mt-1">
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}
