"use client";

import { useEffect, useState } from "react";
import Section from "./Section";
import ProjectsGrid, { type Project } from "./ProjectsGrid";

const FALLBACK: Project[] = [
  {
    id: "fallback-1",
    title: "AI Knowledge Platform",
    category: "RAG / Enterprise Search",
    description:
      "RAG-based enterprise search system over internal documents using LLMs and vector embeddings improved retrieval accuracy by 70%.",
    tags: ["React", "Express", "OpenAI", "LangChain"],
    color: "from-violet-500/30 to-fuchsia-500/30",
    image_url: null,
    href: "https://github.com/yamposskype",
  },
  {
    id: "fallback-2",
    title: "AI Workflow Automation Engine",
    category: "Agents / Event-driven",
    description:
      "Event-driven AI agent system for business workflow automation reduced manual task execution by 80% across operations teams.",
    tags: ["Node.js", "Kafka", "Redis", "OpenAI", "Cassandra"],
    color: "from-cyan-500/30 to-emerald-500/30",
    image_url: null,
    href: "https://github.com/yamposskype",
  },
];

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>(FALLBACK);

  useEffect(() => {
    let cancelled = false;

    async function loadProjects() {
      try {
        const res = await fetch("/api/projects", { cache: "no-store" });
        const data = await res.json().catch(() => null);

        if (!res.ok || !data?.projects || !Array.isArray(data.projects) || data.projects.length === 0) {
          return;
        }

        if (!cancelled) {
          setProjects(data.projects as Project[]);
        }
      } catch {
        return;
      }
    }

    loadProjects();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Section
      id="projects"
      eyebrow="Selected work"
      title={<>AI & full-stack <span className="gradient-text">projects</span></>}
      description="A snapshot of recent systems I've designed and shipped from RAG search to multi-tenant SaaS."
    >
      <ProjectsGrid projects={projects} />
    </Section>
  );
}
