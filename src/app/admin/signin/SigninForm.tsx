"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SigninForm() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Sign-in failed");
      router.replace("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-6 text-center">
        <div className="text-xs uppercase tracking-widest text-accent">Admin</div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Sign in</h1>
        <p className="mt-2 text-sm text-muted">Manage projects and contact messages.</p>
      </div>
      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-2xl border border-border bg-surface/50 p-6"
      >
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">User ID</label>
          <input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
            placeholder="Alex.Admin"
            className="w-full rounded-md border border-border bg-bg/60 px-4 py-3 text-sm outline-none ring-accent/30 transition focus:border-accent/50 focus:ring-2"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-md border border-border bg-bg/60 px-4 py-3 text-sm outline-none ring-accent/30 transition focus:border-accent/50 focus:ring-2"
          />
        </div>
        {error && (
          <div className="rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-gradient-to-r from-accent to-accent2 px-4 py-3 text-sm font-medium text-white transition-transform hover:scale-[1.01] disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
