import { supabaseAdmin } from "@/lib/supabase/admin";
import ProjectsManager, { type ProjectRow } from "./ProjectsManager";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const sb = supabaseAdmin();
  const { data } = await sb
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  return <ProjectsManager initial={(data ?? []) as ProjectRow[]} />;
}
