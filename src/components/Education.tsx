import Section from "./Section";
import Reveal from "./Reveal";
import { GraduationCap } from "lucide-react";

const items = [
  {
    degree: "Master of Science in Computer Science",
    school: "University of Central Florida",
    period: "Graduated 2014",
    gpa: "3.72 / 4.00",
  },
  {
    degree: "Bachelor of Science in Computer Science",
    school: "Florida International University",
    period: "Graduated 2012",
    gpa: "3.64 / 4.00",
  },
];

export default function Education() {
  return (
    <Section
      id="education"
      eyebrow="Academic background"
      title={<>My <span className="gradient-text">education</span></>}
      description="Formal foundations in computer science from two Florida universities."
    >
      <div className="grid gap-6 md:grid-cols-2">
        {items.map((it, i) => (
          <Reveal
            key={it.school}
            delay={i * 100}
            className="card-hover group relative overflow-hidden rounded-2xl border border-border bg-surface/40 p-6"
          >
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-accent/10 opacity-0 blur-3xl transition-opacity group-hover:opacity-100" />
            <div className="relative">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-md bg-gradient-to-br from-accent/20 to-accent2/20 text-accent">
                <GraduationCap size={20} />
              </div>
              <h3 className="text-lg font-semibold leading-snug">{it.degree}</h3>
              <div className="mt-1 text-sm text-accent">{it.school}</div>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted">
                <span className="rounded-full border border-border bg-bg/60 px-2.5 py-0.5">
                  {it.period}
                </span>
                <span className="rounded-full border border-border bg-bg/60 px-2.5 py-0.5">
                  GPA {it.gpa}
                </span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
