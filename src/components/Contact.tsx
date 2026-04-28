"use client";
import Section from "./Section";
import Reveal from "./Reveal";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";

type Status = "idle" | "sending" | "success" | "error";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setStatus("success");
      e.currentTarget.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  const buttonLabel =
    status === "sending"
      ? "Sending…"
      : status === "success"
      ? "Message sent — thanks!"
      : "Send message";

  return (
    <Section
      id="contact"
      eyebrow="Get in touch"
      title={<>Let's build <span className="gradient-text">something great</span></>}
      description="Have a project in mind, or just want to say hi? My inbox is always open."
    >
      <div className="grid gap-8 md:grid-cols-5">
        <Reveal className="space-y-4 md:col-span-2">
          <div className="flex items-start gap-3 rounded-2xl border border-border bg-surface/40 p-5">
            <Mail size={18} className="mt-0.5 text-accent" />
            <div>
              <div className="text-sm font-medium">Email</div>
              <a
                href="mailto:alex.ymapolskyi@yahoo.com"
                className="text-sm text-muted hover:text-text"
              >
                alex.ymapolskyi@yahoo.com
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-2xl border border-border bg-surface/40 p-5">
            <Phone size={18} className="mt-0.5 text-accent" />
            <div>
              <div className="text-sm font-medium">Phone</div>
              <a href="tel:+19176379502" className="text-sm text-muted hover:text-text">
                +1 (917) 637-9502
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-2xl border border-border bg-surface/40 p-5">
            <MapPin size={18} className="mt-0.5 text-accent" />
            <div>
              <div className="text-sm font-medium">Location</div>
              <div className="text-sm text-muted">Boca Raton, FL — open to remote</div>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-gradient-to-br from-accent/10 to-accent2/10 p-5 text-sm text-muted">
            Open to senior AI / full-stack engineering roles and consulting.
            Typically respond within a day.
          </div>
        </Reveal>

        <Reveal delay={150} className="md:col-span-3">
        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-2xl border border-border bg-surface/40 p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" id="name" name="name" placeholder="Your name" />
            <Field label="Email" id="email" name="email" type="email" placeholder="you@email.com" />
          </div>
          <Field label="Subject" id="subject" name="subject" placeholder="What's this about?" />
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              placeholder="Tell me about your project…"
              className="w-full resize-none rounded-xl border border-border bg-bg/60 px-4 py-3 text-sm outline-none ring-accent/30 transition focus:border-accent/50 focus:ring-2"
            />
          </div>
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-accent to-accent2 px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-105 disabled:opacity-60"
            >
              <Send size={14} />
              {buttonLabel}
            </button>
            {status === "error" && (
              <span className="text-xs text-rose-400">{errorMsg}</span>
            )}
          </div>
        </form>
        </Reveal>
      </div>
    </Section>
  );
}

function Field({
  label,
  id,
  name,
  type = "text",
  placeholder,
}: {
  label: string;
  id: string;
  name: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-bg/60 px-4 py-3 text-sm outline-none ring-accent/30 transition focus:border-accent/50 focus:ring-2"
      />
    </div>
  );
}
