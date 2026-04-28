import Section from "./Section";
import Reveal from "./Reveal";

const stats = [
  { value: "10+", label: "Years of experience" },
  { value: "5K+", label: "Concurrent users served" },
  { value: "47×", label: "API latency speedup" },
  { value: "MS", label: "Computer Science, UCF" },
];

export default function About() {
  return (
    <Section
      id="about"
      eyebrow="About me"
      title={<>A bit about <span className="gradient-text">my story</span></>}
      description="Senior Full Stack Engineer with 10+ years of experience building scalable cloud systems and, recently, integrating LLM-based features into production."
    >
      <div className="grid gap-10 md:grid-cols-2 md:gap-14">
        <Reveal className="space-y-5 text-muted leading-relaxed">
          <p>
            I've spent the last decade shipping cloud-native products in
            React, Node.js and Python — from internal tools at Chewy to a
            React + GraphQL platform at Meta Connectivity, a Stripe-backed
            SaaS at Comparent, and most recently a HIPAA-compliant
            telehealth platform at The CareMD.
          </p>
          <p>
            Lately my focus has been on integrating LLM-based features:
            OpenAI APIs, RAG pipelines with LangChain and vector databases
            (Pinecone, FAISS), and event-driven AI agent systems that take
            real work off humans' plates.
          </p>
          <p>
            I'm equally comfortable in the database, the API layer, the
            React frontend, and the Kubernetes manifest — and I care most
            about systems that stay reliable and fast as they grow.
          </p>
        </Reveal>

        <div className="grid grid-cols-2 gap-4">
          {stats.map((s, i) => (
            <Reveal
              key={s.label}
              delay={i * 90}
              className="card-hover group rounded-2xl border border-border bg-surface/40 p-6"
            >
              <div className="text-3xl font-bold sm:text-4xl gradient-text">
                {s.value}
              </div>
              <div className="mt-2 text-sm text-muted">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
