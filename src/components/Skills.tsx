import Section from "./Section";
import Reveal from "./Reveal";
import {
  Code2,
  Brain,
  Layers,
  Cloud,
  Database,
  Cpu,
} from "lucide-react";

const skills = [
  {
    icon: Brain,
    title: "AI / ML & LLMs",
    desc: "Production LLM integrations — OpenAI APIs, RAG pipelines, prompt engineering and vector search.",
    tags: ["OpenAI", "LangChain", "Pinecone", "FAISS", "RAG"],
  },
  {
    icon: Code2,
    title: "Languages",
    desc: "Polyglot engineer working across typed, dynamic and JVM languages depending on the job.",
    tags: ["Python", "TypeScript", "Java", "Go", "Kotlin", "C#"],
  },
  {
    icon: Layers,
    title: "Frameworks",
    desc: "Full-stack across the modern web — APIs, SSR apps and mobile-friendly SPAs.",
    tags: ["React", "Next.js", "Node.js", "FastAPI", "Django", ".NET Core", "Spring Boot"],
  },
  {
    icon: Cloud,
    title: "Cloud & DevOps",
    desc: "Container-first deployments on AWS/Azure/GCP with reliable CI/CD pipelines.",
    tags: ["AWS", "EKS", "Docker", "Kubernetes", "Terraform", "GitHub Actions"],
  },
  {
    icon: Database,
    title: "Data & Storage",
    desc: "Relational, document and search workloads — designed and tuned for production scale.",
    tags: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch", "Kafka"],
  },
  {
    icon: Cpu,
    title: "Architecture",
    desc: "Microservices, event-driven systems and distributed designs that stay debuggable as they grow.",
    tags: ["Microservices", "Event-driven", "System Design", "Distributed"],
  },
];

export default function Skills() {
  return (
    <Section
      id="skills"
      eyebrow="What I do"
      title={<>Skills & <span className="gradient-text">expertise</span></>}
      description="A toolkit built across AI, full-stack engineering, cloud infrastructure and data."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map(({ icon: Icon, title, desc, tags }, i) => (
          <Reveal
            key={title}
            delay={i * 80}
            className="card-hover group relative overflow-hidden rounded-2xl border border-border bg-surface/40 p-6"
          >
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-accent/10 opacity-0 blur-3xl transition-opacity group-hover:opacity-100" />
            <div className="relative">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-accent2/20 text-accent">
                <Icon size={20} />
              </div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">{desc}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border bg-bg/60 px-2.5 py-0.5 text-xs text-muted"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
