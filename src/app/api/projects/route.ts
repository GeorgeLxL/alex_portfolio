import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ projects: data ?? [] });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const sb = supabaseAdmin();
    const { data, error } = await sb
      .from("projects")
      .insert({
        title: body.title ?? "",
        category: body.category ?? "",
        description: body.description ?? "",
        tags: Array.isArray(body.tags) ? body.tags : [],
        color: body.color ?? "from-violet-500/30 to-fuchsia-500/30",
        image_url: body.image_url ?? null,
        href: body.href ?? null,
        sort_order: typeof body.sort_order === "number" ? body.sort_order : 0,
      })
      .select("*")
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ project: data });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
