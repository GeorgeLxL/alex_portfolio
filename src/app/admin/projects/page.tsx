import { supabaseAdmin } from "@/lib/supabase";
import ProjectsManager, { type ProjectRow } from "./ProjectsManager";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  try {
    const { data } = await supabaseAdmin
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    return <ProjectsManager initial={(data ?? []) as ProjectRow[]} />;
  } catch {
    return <ProjectsManager initial={[]} />;
  }
}
