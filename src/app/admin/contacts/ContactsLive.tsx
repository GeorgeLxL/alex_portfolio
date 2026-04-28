"use client";
import { useEffect, useState } from "react";
import { Mail, Trash2, Check, CircleDot } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/browser";

export type MessageRow = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
};

export default function ContactsLive({ initial }: { initial: MessageRow[] }) {
  const [items, setItems] = useState<MessageRow[]>(initial);
  const [selected, setSelected] = useState<MessageRow | null>(initial[0] ?? null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const sb = supabaseBrowser();
    const channel = sb
      .channel("messages-feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const row = payload.new as MessageRow;
          setItems((prev) => [row, ...prev.filter((p) => p.id !== row.id)]);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages" },
        (payload) => {
          const row = payload.new as MessageRow;
          setItems((prev) => prev.map((p) => (p.id === row.id ? row : p)));
          setSelected((s) => (s && s.id === row.id ? row : s));
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "messages" },
        (payload) => {
          const row = payload.old as MessageRow;
          setItems((prev) => prev.filter((p) => p.id !== row.id));
          setSelected((s) => (s && s.id === row.id ? null : s));
        }
      )
      .subscribe((status) => {
        setConnected(status === "SUBSCRIBED");
      });
    return () => {
      sb.removeChannel(channel);
    };
  }, []);

  async function toggleRead(m: MessageRow) {
    await fetch(`/api/messages/${m.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: !m.read }),
    });
  }

  async function deleteMessage(m: MessageRow) {
    if (!confirm("Delete this message?")) return;
    await fetch(`/api/messages/${m.id}`, { method: "DELETE" });
  }

  const unread = items.filter((m) => !m.read).length;

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Contacts</h1>
          <p className="mt-1 text-sm text-muted">
            {items.length} total · {unread} unread
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted">
          <span
            className={`h-2 w-2 rounded-full ${
              connected ? "bg-emerald-400 animate-pulse" : "bg-rose-400"
            }`}
          />
          {connected ? "Live" : "Disconnected"}
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[360px,1fr]">
        <div className="rounded-2xl border border-border bg-surface/30 p-2 max-h-[70vh] overflow-y-auto">
          {items.length === 0 && (
            <div className="p-8 text-center text-sm text-muted">No messages yet.</div>
          )}
          {items.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelected(m)}
              className={`w-full text-left rounded-md p-3 transition-colors ${
                selected?.id === m.id ? "bg-accent/15" : "hover:bg-bg/60"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="font-medium text-sm flex items-center gap-1.5 truncate">
                  {!m.read && <CircleDot size={10} className="text-accent shrink-0" />}
                  {m.name}
                </div>
                <div className="text-[11px] text-muted shrink-0">
                  {timeAgo(m.created_at)}
                </div>
              </div>
              <div className="text-xs text-muted truncate">{m.subject}</div>
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-surface/40 p-6">
          {!selected ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-sm text-muted">
              <Mail size={28} className="mb-3 text-muted" />
              Select a message to read it.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs text-muted">{new Date(selected.created_at).toLocaleString()}</div>
                  <h2 className="mt-1 text-xl font-semibold">{selected.subject}</h2>
                  <div className="mt-1 text-sm text-muted">
                    From{" "}
                    <span className="text-text">{selected.name}</span>{" "}
                    &lt;
                    <a
                      href={`mailto:${selected.email}`}
                      className="text-accent hover:underline"
                    >
                      {selected.email}
                    </a>
                    &gt;
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleRead(selected)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs text-muted hover:text-text"
                  >
                    <Check size={13} />
                    {selected.read ? "Mark unread" : "Mark read"}
                  </button>
                  <button
                    onClick={() => deleteMessage(selected)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs text-muted hover:text-rose-400"
                  >
                    <Trash2 size={13} />
                    Delete
                  </button>
                </div>
              </div>

              <div className="rounded-md border border-border bg-bg/40 p-4 text-sm whitespace-pre-wrap leading-relaxed">
                {selected.message}
              </div>

              <div>
                <a
                  href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                  className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-accent to-accent2 px-4 py-2 text-sm font-medium text-white"
                >
                  <Mail size={14} /> Reply by email
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}
