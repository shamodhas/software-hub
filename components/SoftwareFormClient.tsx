"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";

export interface SoftwareFormValues {
  id?: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  categoryId: string;
  platform: string;
  license: string;
  status: string;
  featured: boolean;
  githubRepoUrl: string;
  githubReleasesUrl: string;
  docsUrl: string;
  iconName: string;
  requirements: string[];
  setupSteps: string[];
}

export function SoftwareFormClient({
  categories,
  initialValues,
  mode,
}: {
  categories: { id: string; name: string }[];
  initialValues?: SoftwareFormValues;
  mode: "create" | "edit";
}) {
  const router = useRouter();
  const [form, setForm] = useState<SoftwareFormValues>(
    initialValues || {
      name: "",
      slug: "",
      tagline: "",
      description: "",
      categoryId: categories[0]?.id || "",
      platform: "Windows x64",
      license: "MIT",
      status: "PUBLISHED",
      featured: false,
      githubRepoUrl: "",
      githubReleasesUrl: "",
      docsUrl: "",
      iconName: "Package",
      requirements: ["Windows 10 or Windows 11 (64-bit)"],
      setupSteps: ["Download the executable and launch."],
    }
  );

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function handleNameChange(name: string) {
    setForm((prev) => ({
      ...prev,
      name,
      slug:
        mode === "create"
          ? name
              .toLowerCase()
              .trim()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-+|-+$/g, "")
          : prev.slug,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const endpoint =
        mode === "create"
          ? "/api/admin/software"
          : `/api/admin/software/${form.id}`;
      const method = mode === "create" ? "POST" : "PATCH";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save software package.");
        setSaving(false);
        return;
      }

      if (mode === "create") {
        router.push(`/admin/software/${data.id}/releases`);
      } else {
        router.push("/admin");
      }
      router.refresh();
    } catch {
      setError("Network error while saving software.");
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-emerald-400"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Admin Dashboard</span>
        </Link>

        {mode === "edit" && form.id && (
          <Link
            href={`/admin/software/${form.id}/releases`}
            className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20"
          >
            Manage Releases &amp; Artifacts →
          </Link>
        )}
      </div>

      <h1 className="mt-4 text-2xl font-bold text-white">
        {mode === "create"
          ? "Register New Software Package"
          : `Edit Software: ${form.name}`}
      </h1>

      {error && (
        <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs font-medium text-rose-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* Core Identity */}
        <div className="rounded-2xl border border-slate-800/90 bg-slate-900/60 p-6">
          <h2 className="text-sm font-bold text-white">
            1. Package Identity &amp; Classification
          </h2>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-slate-300">
                Software Name *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g., Android Mirror"
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white focus:border-emerald-500/60 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300">
                URL Slug *
              </label>
              <input
                type="text"
                required
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="android-mirror"
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 font-mono text-sm text-white focus:border-emerald-500/60 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300">
                Category *
              </label>
              <select
                value={form.categoryId}
                onChange={(e) =>
                  setForm({ ...form, categoryId: e.target.value })
                }
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white focus:border-emerald-500/60 focus:outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300">
                Platform *
              </label>
              <input
                type="text"
                required
                value={form.platform}
                onChange={(e) => setForm({ ...form, platform: e.target.value })}
                placeholder="Windows x64, Cross-Platform, JVM / Node.js..."
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white focus:border-emerald-500/60 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300">
                License *
              </label>
              <input
                type="text"
                required
                value={form.license}
                onChange={(e) => setForm({ ...form, license: e.target.value })}
                placeholder="MIT, Apache-2.0, GPL-3.0..."
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white focus:border-emerald-500/60 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300">
                Icon Preset
              </label>
              <select
                value={form.iconName}
                onChange={(e) => setForm({ ...form, iconName: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white focus:border-emerald-500/60 focus:outline-none"
              >
                <option value="Package">Package (Default)</option>
                <option value="Smartphone">Smartphone (Android / Mobile)</option>
                <option value="Terminal">Terminal (CLI / DevOps)</option>
                <option value="ShieldCheck">ShieldCheck (Security / Auth)</option>
                <option value="Code2">Code2 (SDK / Library)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300">
                Visibility Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white focus:border-emerald-500/60 focus:outline-none"
              >
                <option value="PUBLISHED">PUBLISHED (Live on portal)</option>
                <option value="DRAFT">DRAFT (Hidden from public)</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </div>

            <div className="flex items-center pt-6">
              <label className="inline-flex cursor-pointer items-center gap-2.5 text-sm text-slate-200">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) =>
                    setForm({ ...form, featured: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-emerald-500"
                />
                <span>Feature on Home Page Flagship Spotlight</span>
              </label>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-medium text-slate-300">
              One-Line Tagline *
            </label>
            <input
              type="text"
              required
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              placeholder="Concise summary shown on cards and SEO meta tags..."
              className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white focus:border-emerald-500/60 focus:outline-none"
            />
          </div>

          <div className="mt-4">
            <label className="block text-xs font-medium text-slate-300">
              Full Overview &amp; Technical Description (Markdown / Text) *
            </label>
            <textarea
              rows={6}
              required
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Detailed overview, architecture notes, and key features..."
              className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-sm text-white focus:border-emerald-500/60 focus:outline-none"
            />
          </div>
        </div>

        {/* Repository & Documentation Links */}
        <div className="rounded-2xl border border-slate-800/90 bg-slate-900/60 p-6">
          <h2 className="text-sm font-bold text-white">
            2. GitHub Repository &amp; Documentation Links
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-medium text-slate-300">
                GitHub Repository URL
              </label>
              <input
                type="url"
                value={form.githubRepoUrl}
                onChange={(e) =>
                  setForm({ ...form, githubRepoUrl: e.target.value })
                }
                placeholder="https://github.com/shamodhas/..."
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500/60 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300">
                GitHub Releases URL
              </label>
              <input
                type="url"
                value={form.githubReleasesUrl}
                onChange={(e) =>
                  setForm({ ...form, githubReleasesUrl: e.target.value })
                }
                placeholder="https://github.com/shamodhas/.../releases"
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500/60 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300">
                Documentation URL
              </label>
              <input
                type="url"
                value={form.docsUrl}
                onChange={(e) => setForm({ ...form, docsUrl: e.target.value })}
                placeholder="https://github.com/shamodhas/...#readme"
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500/60 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Requirements Array */}
        <div className="rounded-2xl border border-slate-800/90 bg-slate-900/60 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">
              3. System Requirements
            </h2>
            <button
              type="button"
              onClick={() =>
                setForm({
                  ...form,
                  requirements: [...form.requirements, ""],
                })
              }
              className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Requirement</span>
            </button>
          </div>

          <div className="mt-3 space-y-2.5">
            {form.requirements.map((req, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={req}
                  onChange={(e) => {
                    const updated = [...form.requirements];
                    updated[idx] = e.target.value;
                    setForm({ ...form, requirements: updated });
                  }}
                  placeholder="e.g., Windows 10 or Windows 11 (64-bit)"
                  className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                />
                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      requirements: form.requirements.filter(
                        (_, i) => i !== idx
                      ),
                    })
                  }
                  className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-2 text-rose-300 hover:bg-rose-500/20"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Setup Steps Array */}
        <div className="rounded-2xl border border-slate-800/90 bg-slate-900/60 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">
              4. Quick-Start Installation Steps
            </h2>
            <button
              type="button"
              onClick={() =>
                setForm({
                  ...form,
                  setupSteps: [...form.setupSteps, ""],
                })
              }
              className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Step</span>
            </button>
          </div>

          <div className="mt-3 space-y-2.5">
            {form.setupSteps.map((step, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="font-mono text-xs text-emerald-400">
                  #{idx + 1}
                </span>
                <input
                  type="text"
                  value={step}
                  onChange={(e) => {
                    const updated = [...form.setupSteps];
                    updated[idx] = e.target.value;
                    setForm({ ...form, setupSteps: updated });
                  }}
                  placeholder="Step instruction..."
                  className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                />
                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      setupSteps: form.setupSteps.filter((_, i) => i !== idx),
                    })
                  }
                  className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-2 text-rose-300 hover:bg-rose-500/20"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Link
            href="/admin"
            className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>
              {saving
                ? "Saving..."
                : mode === "create"
                ? "Create & Configure Releases →"
                : "Save Changes"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}

