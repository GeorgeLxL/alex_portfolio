import Section from "./Section";
import ProjectsGrid, { type Project } from "./ProjectsGrid";
import { supabaseAdmin } from "@/lib/supabase/admin";

const FALLBACK: Project[] = [
  {
    id: "fallback-1",
    title: "AI Knowledge Platform",
    category: "RAG / Enterprise Search",
    description:
      "RAG-based enterprise search system over internal documents using LLMs and vector embeddings — improved retrieval accuracy by 70%.",
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
      "Event-driven AI agent system for business workflow automation — reduced manual task execution by 80% across operations teams.",
    tags: ["Node.js", "Kafka", "Redis", "OpenAI", "Cassandra"],
    color: "from-cyan-500/30 to-emerald-500/30",
    image_url: null,
    href: "https://github.com/yamposskype",
  },
];

async function loadProjects(): Promise<Project[]> {
  try {
    const sb = supabaseAdmin();
    const { data, error } = await sb
      .from("projects")
      .select("id, title, category, description, tags, color, image_url, href")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error || !data || data.length === 0) return FALLBACK;
    return data as Project[];
  } catch {
    return FALLBACK;
  }
}

export default async function Projects() {
  const projects = await loadProjects();
  return (
    <Section
      id="projects"
      eyebrow="Selected work"
      title={<>AI & full-stack <span className="gradient-text">projects</span></>}
      description="A snapshot of recent systems I've designed and shipped — from RAG search to multi-tenant SaaS."
    >
      <ProjectsGrid projects={projects} />
    </Section>
  );
}
