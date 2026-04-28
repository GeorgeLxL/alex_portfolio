import Section from "./Section";
import Reveal from "./Reveal";

const items = [
  {
    role: "Senior Full Stack Software Engineer",
    company: "The CareMD — USA",
    period: "Jun 2023 — Nov 2025",
    bullets: [
      "Built and scaled a HIPAA-compliant telehealth platform (React + TS, Python Flask + FastAPI, PostgreSQL) supporting 5,000+ concurrent patient–doctor interactions.",
      "Evolved a Flask monolith into FastAPI async services for real-time signaling and telemetry, isolating consultation workloads from medical-record systems.",
      "Migrated infrastructure from EC2 to containerized services on Docker + Amazon EKS, improving scalability and release reliability.",
      "Built AI-assisted features with OpenAI APIs and prototyped RAG retrieval over medical records using LangChain + FAISS/Pinecone.",
      "Reduced doctor-search p95 latency from 4000ms → 85ms via materialized views and Elasticsearch indexing while scaling to 300% data growth.",
    ],
  },
  {
    role: "Senior Full Stack Engineer",
    company: "Comparent — USA",
    period: "Jun 2020 — Dec 2022",
    bullets: [
      "Architected and shipped a membership SaaS (React SPA, Django REST, PostgreSQL) on AWS (EC2, RDS, S3, CloudFront, Route 53).",
      "Integrated Stripe Checkout + Customer Portal with real-time webhook processing for tier-based access control.",
      "Designed a scalable PostgreSQL schema with composite indexes and PgBouncer pooling for high concurrency.",
      "Owned full delivery — frontend, backend, billing, AWS infra and CI/CD (GitHub Actions, zero-downtime via Gunicorn + Nginx).",
      "Resolved Stripe webhook race conditions with idempotent processing; launched with 500+ users onboarded in 48h, zero production incidents.",
    ],
  },
  {
    role: "Full Stack Software Engineer",
    company: "Meta Connectivity — USA",
    period: "Jul 2018 — Jun 2020",
    bullets: [
      "Contributed to a large-scale React + GraphQL platform used across the Facebook ecosystem.",
      "Reduced CSS payload by ~80% via architecture refactoring and built a tiered JavaScript delivery system.",
      "Implemented route prefetching and streaming GraphQL (@stream, @defer) for faster UI rendering.",
      "Worked on performance governance — bundle-size monitoring and dependency tracking.",
    ],
  },
  {
    role: "Full Stack Developer",
    company: "Chewy — USA",
    period: "Jan 2015 — Jun 2018",
    bullets: [
      "Built internal order management and customer support tools (AngularJS 1.5, Node/Express, MySQL) handling ~3–5k daily orders at peak.",
      "Added server-side validation and request deduplication, reducing duplicate-order issues.",
      "Refactored legacy jQuery into AngularJS components, cutting UI-related bug tickets by ~25%.",
      "Integrated early Stripe + Mandrill, debugging webhook timing with idempotency checks and retry logging.",
      "Tuned slow reporting queries from 2–3s to sub-second via indexing and join restructuring.",
    ],
  },
];

export default function Experience() {
  return (
    <Section
      id="experience"
      eyebrow="My journey"
      title={<>Where I've <span className="gradient-text">worked</span></>}
      description="A timeline of roles that shaped how I design and ship systems today."
    >
      <ol className="relative ml-3 border-l border-border">
        {items.map((it, i) => (
          <li key={i} className="mb-10 pl-8 last:mb-0">
            <span className="absolute -left-[7px] mt-1.5 h-3.5 w-3.5 rounded-full bg-gradient-to-br from-accent to-accent2 ring-4 ring-bg" />
            <Reveal
              delay={i * 100}
              className="card-hover rounded-2xl border border-border bg-surface/40 p-6"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-lg font-semibold">{it.role}</h3>
                <span className="text-xs text-muted">{it.period}</span>
              </div>
              <div className="mt-1 text-sm text-accent">{it.company}</div>
              <ul className="mt-3 space-y-2 text-sm text-muted leading-relaxed">
                {it.bullets.map((b, j) => (
                  <li key={j} className="flex gap-2">
                    <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-accent/70" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}
