import { quote } from "@/lib/data";

export default function QuoteBlock() {
  return (
    <section className="bg-green-main px-5 py-14 text-center">
      <span className="font-oswald text-6xl text-gold leading-none block mb-3">"</span>
      <blockquote className="font-oswald text-white text-xl md:text-2xl font-medium
                             italic leading-relaxed max-w-2xl mx-auto mb-5">
        {quote.text}
      </blockquote>
      <cite className="text-gold text-xs tracking-[0.18em] uppercase font-bold not-italic">
        {quote.attribution}
      </cite>
    </section>
  );
}
