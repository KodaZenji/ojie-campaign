import { gratitude } from "@/lib/data";

export default function GratitudeNote() {
  return (
    <section className="border-y-4 border-green-main bg-gray-50 px-5 py-10 text-center">
      <div className="max-w-2xl mx-auto">
        <p className="text-sm text-gray-500 leading-relaxed italic mb-4">
          {gratitude.text}
        </p>
        <p className="font-oswald text-green-main font-semibold text-base">
          {gratitude.signature}
        </p>
      </div>
    </section>
  );
}
