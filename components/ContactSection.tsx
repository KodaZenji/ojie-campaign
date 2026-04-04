"use client";
import { useState } from "react";
import { contact, candidate } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import WhatsAppIcon from "./icons/WhatsAppIcon";

export default function ContactSection() {
  const waUrl = `https://wa.me/${candidate.whatsappNumber}?text=${encodeURIComponent(
    candidate.whatsappMessage
  )}`;

  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    setStatus("sending");

    try {
      // Save to Supabase
      const { error } = await supabase
        .from("contact_messages")
        .insert([{
          name: form.name,
          phone: form.phone,
          message: form.message,
          is_read: false,
        }]);

      if (error) throw error;

      setStatus("sent");
      setForm({ name: "", phone: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="bg-green-main px-5 py-14">
      <div className="max-w-lg mx-auto text-center">

        {/* Headline */}
        <h2 className="font-oswald font-bold text-white text-3xl md:text-4xl mb-2">
          {contact.headline}
        </h2>
        <p className="text-green-muted text-sm mb-8">{contact.subline}</p>

        {/* WhatsApp primary CTA */}
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-wa text-base px-8 py-4 mb-10 mx-auto"
        >
          <WhatsAppIcon size={22} />
          {contact.waLabel}
        </a>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex-1 h-px bg-green-light opacity-40" />
          <span className="text-green-muted text-xs tracking-widest uppercase">or send a message</span>
          <div className="flex-1 h-px bg-green-light opacity-40" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-left">

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder={contact.formFields.name}
            required
            className="w-full bg-green-mid border border-green-light rounded px-4 py-3
                       text-white text-sm placeholder:text-green-muted outline-none
                       focus:border-gold transition-colors"
          />

          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder={contact.formFields.phone}
            required
            className="w-full bg-green-mid border border-green-light rounded px-4 py-3
                       text-white text-sm placeholder:text-green-muted outline-none
                       focus:border-gold transition-colors"
          />

          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder={contact.formFields.message}
            rows={4}
            className="w-full bg-green-mid border border-green-light rounded px-4 py-3
                       text-white text-sm placeholder:text-green-muted outline-none
                       focus:border-gold transition-colors resize-none"
          />

          <button
            type="submit"
            disabled={status === "sending" || status === "sent"}
            className="w-full bg-gold text-gold-dark font-oswald font-bold text-base
                       tracking-wide py-4 rounded transition-all
                       hover:brightness-110 active:scale-95
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === "sending" && "Sending..."}
            {status === "sent" && "Message Sent ✓"}
            {status === "error" && "Try Again"}
            {status === "idle" && contact.formFields.submit}
          </button>

          {status === "error" && (
            <p className="text-red-300 text-sm text-center">
              Something went wrong. Please try WhatsApp instead.
            </p>
          )}

        </form>
      </div>
    </section>
  );
}
