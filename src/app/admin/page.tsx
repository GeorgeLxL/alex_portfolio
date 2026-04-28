import Link from "next/link";
import { FolderKanban, Mail } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  let projectCount = 0;
  let messageCount = 0;
  let unreadCount = 0;

  try {
    const [projects, messages, unread] = await Promise.all([
      supabaseAdmin.from("projects").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("messages").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("messages").select("id", { count: "exact", head: true }).eq("read", false),
    ]);

    projectCount = projects.count ?? 0;
    messageCount = messages.count ?? 0;
    unreadCount = unread.count ?? 0;
  } catch {}

  const stats = [
    { label: "Projects", value: projectCount, href: "/admin/projects", Icon: FolderKanban },
    { label: "Messages", value: messageCount, href: "/admin/contacts", Icon: Mail },
    { label: "Unread", value: unreadCount, href: "/admin/contacts", Icon: Mail },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Dashboard</h1>
      <p className="mt-2 text-sm text-muted">Welcome back, Alex.Admin.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, href, Icon }) => (
          <Link
            key={label}
            href={href}
            className="card-hover rounded-2xl border border-border bg-surface/40 p-6"
          >
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase tracking-widest text-muted">{label}</div>
              <Icon size={16} className="text-accent" />
            </div>
            <div className="mt-3 text-3xl font-bold gradient-text">{value}</div>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-surface/30 p-6 text-sm text-muted">
        Quick links:{" "}
        <Link href="/admin/projects" className="text-accent hover:underline">
          manage projects
        </Link>{" "}
        ·{" "}
        <Link href="/admin/contacts" className="text-accent hover:underline">
          view messages
        </Link>
      </div>
    </div>
  );
}
