"use client";
import Reveal from "./Reveal";
import { ArrowUpRight } from "lucide-react";

export type Project = {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  color: string;
  image_url: string | null;
  href: string | null;
};

export default function ProjectsGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {projects.map((p, i) => {
        const cardClass =
          "card-hover group relative block overflow-hidden rounded-3xl border border-border bg-surface/40 p-1";
        const inner = (
          <>
            <div className={`relative h-56 overflow-hidden rounded-2xl bg-gradient-to-br ${p.color}`}>
              {p.image_url && (
                <img
                  src={p.image_url}
                  alt={p.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-bg/10 to-transparent" />
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <span className="rounded-full bg-bg/70 px-3 py-1 text-xs font-medium backdrop-blur">
                  {p.category}
                </span>
              </div>
              {p.href && (
                <div className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-md bg-bg/70 backdrop-blur transition-transform group-hover:rotate-45">
                  <ArrowUpRight size={16} />
                </div>
              )}
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">{p.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </>
        );

        return p.href ? (
          <Reveal
            key={p.id}
            as="a"
            href={p.href}
            target="_blank"
            rel="noreferrer"
            delay={i * 110}
            className={cardClass}
          >
            {inner}
          </Reveal>
        ) : (
          <Reveal key={p.id} delay={i * 110} className={cardClass}>
            {inner}
          </Reveal>
        );
      })}
    </div>
  );
}
