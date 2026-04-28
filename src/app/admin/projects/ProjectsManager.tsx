"use client";
import { useState } from "react";
import { Plus, Pencil, Trash2, X, Save, Upload, ImageIcon, Loader2 } from "lucide-react";

export type ProjectRow = {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  color: string;
  image_url: string | null;
  href: string | null;
  sort_order: number;
  created_at: string;
};

const COLOR_OPTIONS = [
  "from-violet-500/30 to-fuchsia-500/30",
  "from-cyan-500/30 to-emerald-500/30",
  "from-amber-500/30 to-rose-500/30",
  "from-blue-500/30 to-indigo-500/30",
  "from-pink-500/30 to-orange-500/30",
  "from-teal-500/30 to-sky-500/30",
];

const empty: Omit<ProjectRow, "id" | "created_at"> = {
  title: "",
  category: "",
  description: "",
  tags: [],
  color: COLOR_OPTIONS[0],
  image_url: "",
  href: "",
  sort_order: 0,
};

export default function ProjectsManager({ initial }: { initial: ProjectRow[] }) {
  const [items, setItems] = useState<ProjectRow[]>(initial);
  const [editing, setEditing] = useState<ProjectRow | null>(null);
  const [creating, setCreating] = useState(false);

  async function createProject(payload: typeof empty) {
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed");
    setItems((prev) => [...prev, data.project]);
  }

  async function updateProject(id: string, payload: Partial<ProjectRow>) {
    const res = await fetch(`/api/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed");
    setItems((prev) => prev.map((p) => (p.id === id ? data.project : p)));
  }

  async function deleteProject(id: string) {
    if (!confirm("Delete this project?")) return;
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Failed");
      return;
    }
    setItems((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Projects</h1>
          <p className="mt-1 text-sm text-muted">
            Create, edit and reorder projects shown on your landing page.
          </p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-accent to-accent2 px-4 py-2 text-sm font-medium text-white"
        >
          <Plus size={14} /> New project
        </button>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {items.length === 0 && (
          <div className="md:col-span-2 rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted">
            No projects yet. Click "New project" to create one.
          </div>
        )}
        {items.map((p) => (
          <div
            key={p.id}
            className="rounded-2xl border border-border bg-surface/40 p-5"
          >
            <div className={`relative h-32 overflow-hidden rounded-md bg-gradient-to-br ${p.color}`}>
              {p.image_url && (
                <img
                  src={p.image_url}
                  alt={p.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
            </div>
            <div className="mt-3 flex items-start justify-between gap-2">
              <div>
                <div className="text-xs text-accent">{p.category}</div>
                <div className="font-semibold">{p.title}</div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setEditing(p)}
                  className="rounded-md border border-border p-1.5 text-muted hover:text-text"
                  aria-label="Edit"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => deleteProject(p.id)}
                  className="rounded-md border border-border p-1.5 text-muted hover:text-rose-400"
                  aria-label="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <p className="mt-2 text-sm text-muted line-clamp-2">{p.description}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {p.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {(creating || editing) && (
        <ProjectModal
          initial={editing ?? { ...empty, id: "", created_at: "" }}
          isNew={creating}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
          onSubmit={async (payload) => {
            if (creating) await createProject(payload);
            else if (editing) await updateProject(editing.id, payload);
            setCreating(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function ProjectModal({
  initial,
  isNew,
  onClose,
  onSubmit,
}: {
  initial: ProjectRow | (Omit<ProjectRow, "id" | "created_at"> & { id: string; created_at: string });
  isNew: boolean;
  onClose: () => void;
  onSubmit: (p: Omit<ProjectRow, "id" | "created_at">) => Promise<void>;
}) {
  const [title, setTitle] = useState(initial.title);
  const [category, setCategory] = useState(initial.category);
  const [description, setDescription] = useState(initial.description);
  const [tagsInput, setTagsInput] = useState(initial.tags.join(", "));
  const [color, setColor] = useState(initial.color);
  const [imageUrl, setImageUrl] = useState(initial.image_url ?? "");
  const [href, setHref] = useState(initial.href ?? "");
  const [sortOrder, setSortOrder] = useState(initial.sort_order);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File | null) {
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/projects/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setImageUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await onSubmit({
        title,
        category,
        description,
        tags: tagsInput
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        color,
        image_url: imageUrl || null,
        href: href || null,
        sort_order: Number(sortOrder) || 0,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-surface p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {isNew ? "New project" : "Edit project"}
          </h2>
          <button onClick={onClose} className="text-muted hover:text-text">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Title" value={title} onChange={setTitle} required />
            <Input label="Category" value={category} onChange={setCategory} required />
          </div>
          <Textarea label="Description" value={description} onChange={setDescription} required />
          <Input
            label="Tags (comma-separated)"
            value={tagsInput}
            onChange={setTagsInput}
            placeholder="React, Next.js, OpenAI"
          />
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted">Image</label>
            <div className="flex items-start gap-3">
              <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-md border border-border bg-bg/60">
                {imageUrl ? (
                  <>
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setImageUrl("")}
                      className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-md bg-black/60 text-white hover:bg-black/80"
                      aria-label="Remove image"
                    >
                      <X size={12} />
                    </button>
                  </>
                ) : (
                  <div className="grid h-full w-full place-items-center text-muted">
                    <ImageIcon size={20} />
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 grid place-items-center bg-black/60 text-white">
                    <Loader2 size={18} className="animate-spin" />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border bg-bg/60 px-3 py-2 text-sm text-text hover:border-accent/50">
                  <Upload size={14} />
                  {uploading ? "Uploading…" : imageUrl ? "Replace image" : "Upload image"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploading}
                    onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                  />
                </label>
                <p className="text-[11px] text-muted">
                  JPG, PNG, WebP, GIF or SVG · up to 5 MB · stored in Supabase
                </p>
              </div>
            </div>
          </div>
          <Input label="Link URL" value={href} onChange={setHref} placeholder="https://github.com/…" />
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted">Gradient color</label>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {COLOR_OPTIONS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  className={`h-10 rounded-md bg-gradient-to-br ${c} ring-offset-2 ring-offset-surface ${
                    color === c ? "ring-2 ring-accent" : ""
                  }`}
                  aria-label={c}
                />
              ))}
            </div>
          </div>
          <Input
            label="Sort order"
            value={String(sortOrder)}
            onChange={(v) => setSortOrder(Number(v) || 0)}
            type="number"
          />

          {error && (
            <div className="rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-border px-4 py-2 text-sm text-muted hover:text-text"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-accent to-accent2 px-5 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              <Save size={14} />
              {saving ? "Saving…" : isNew ? "Create" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-md border border-border bg-bg/60 px-3 py-2.5 text-sm outline-none ring-accent/30 transition focus:border-accent/50 focus:ring-2"
      />
    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        rows={4}
        className="w-full resize-none rounded-md border border-border bg-bg/60 px-3 py-2.5 text-sm outline-none ring-accent/30 transition focus:border-accent/50 focus:ring-2"
      />
    </div>
  );
}
