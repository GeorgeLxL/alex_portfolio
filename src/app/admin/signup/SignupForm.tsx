"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupForm() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Signup failed");
      router.replace("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-6 text-center">
        <div className="text-xs uppercase tracking-widest text-accent">First-time setup</div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Create admin</h1>
        <p className="mt-2 text-sm text-muted">
          Only one admin can exist. The user ID must be{" "}
          <code className="rounded bg-surface/80 px-1.5 py-0.5 text-text">Alex.Admin</code>.
        </p>
      </div>
      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-2xl border border-border bg-surface/50 p-6"
      >
        <Field label="User ID" value={userId} onChange={setUserId} placeholder="Alex.Admin" />
        <Field
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="At least 8 characters"
        />
        <Field
          label="Confirm password"
          type="password"
          value={confirm}
          onChange={setConfirm}
          placeholder="Repeat password"
        />
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
          {loading ? "Creating…" : "Create admin"}
        </button>
        <div className="text-center text-xs text-muted">
          Already have an account?{" "}
          <Link href="/admin/signin" className="text-accent hover:underline">
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        placeholder={placeholder}
        className="w-full rounded-md border border-border bg-bg/60 px-4 py-3 text-sm outline-none ring-accent/30 transition focus:border-accent/50 focus:ring-2"
      />
    </div>
  );
}
