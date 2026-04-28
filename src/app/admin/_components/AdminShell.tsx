"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FolderKanban, Mail, LogOut } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const navItems = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", Icon: FolderKanban },
  { href: "/admin/contacts", label: "Contacts", Icon: Mail },
];

const HIDE_SHELL = ["/admin/signin", "/admin/signup"];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (HIDE_SHELL.includes(pathname)) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        {children}
      </main>
    );
  }

  async function signOut() {
    await fetch("/api/admin/signout", { method: "POST" });
    router.replace("/admin/signin");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex">
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-border bg-surface/50 px-4 py-6">
        <div className="px-2 mb-8">
          <div className="text-xs uppercase tracking-widest text-muted">Admin</div>
          <div className="mt-1 font-semibold gradient-text">Alex.Admin</div>
        </div>
        <nav className="flex-1 space-y-1">
          {navItems.map(({ href, label, Icon }) => {
            const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-accent/15 text-text"
                    : "text-muted hover:bg-bg/60 hover:text-text"
                }`}
              >
                <Icon size={15} />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="space-y-2">
          <ThemeToggle />
          <button
            onClick={signOut}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted transition-colors hover:bg-bg/60 hover:text-text"
          >
            <LogOut size={15} />
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="md:hidden flex items-center justify-between border-b border-border bg-surface/50 px-4 py-3">
          <div className="font-semibold gradient-text">Alex.Admin</div>
          <ThemeToggle />
        </header>

        <nav className="md:hidden flex gap-1 border-b border-border bg-surface/30 px-2 py-2 overflow-x-auto">
          {navItems.map(({ href, label, Icon }) => {
            const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-xs transition-colors ${
                  active ? "bg-accent/15 text-text" : "text-muted hover:text-text"
                }`}
              >
                <Icon size={13} />
                {label}
              </Link>
            );
          })}
          <button
            onClick={signOut}
            className="ml-auto flex items-center gap-1 rounded-md px-3 py-1.5 text-xs text-muted hover:text-text"
          >
            <LogOut size={13} /> Sign out
          </button>
        </nav>

        <main className="px-6 py-8 md:px-10 md:py-10">{children}</main>
      </div>
    </div>
  );
}
