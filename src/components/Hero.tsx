"use client";
import { ArrowRight, Github, Linkedin, Mail, MapPin } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center px-6 pt-24"
    >
      <div className="pointer-events-none absolute left-1/2 top-1/4 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute right-1/4 top-1/2 -z-10 h-72 w-72 rounded-full bg-accent2/20 blur-3xl" />

      <div className="mx-auto max-w-4xl text-center animate-fade-up">
        <h1 className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl gradient-text">
          Oleksandr Yampolskyi
        </h1>

        <h2 className="mt-4 text-xl font-medium tracking-tight text-text/90 sm:text-2xl md:text-3xl">
          Senior <span className="text-accent">AI</span> /{" "}
          <span className="text-accent2">Full-Stack</span> Engineer
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-base text-muted sm:text-lg">
          I architect production-grade cloud platforms and weave{" "}
          <span className="text-text">LLM-powered intelligence</span> into the
          products people use every day — from RAG search and agentic
          workflows to HIPAA-grade real-time systems serving thousands of
          concurrent users.
        </p>

        <div className="mt-6 inline-flex items-center gap-1.5 text-xs text-muted">
          <MapPin size={12} /> Boca Raton, FL — open to remote
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#projects"
            className="group inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-accent to-accent2 px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-105"
          >
            View my work
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-surface/40 px-6 py-3 text-sm font-medium text-text transition-colors hover:border-accent/50"
          >
            Get in touch
          </a>
        </div>

        <div className="mt-10 flex items-center justify-center gap-5">
          {[
            { icon: Github, href: "https://github.com/yamposskype" },
            { icon: Linkedin, href: "https://linkedin.com/in/alexyampolskyi" },
            { icon: Mail, href: "mailto:alex.ymapolskyi@yahoo.com" },
          ].map(({ icon: Icon, href }, i) => (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="grid h-10 w-10 place-items-center rounded-md border border-border bg-surface/40 text-muted transition-all hover:border-accent/50 hover:text-text"
            >
              <Icon size={16} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
