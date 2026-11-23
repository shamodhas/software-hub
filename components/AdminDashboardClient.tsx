"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  CheckCircle2,
  Tag,
  Download,
  Search,
  Plus,
  Edit3,
  Layers,
  Trash2,
  Star,
  ExternalLink,
} from "lucide-react";

export interface AdminSoftwareRow {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  platform: string;
  license: string;
  status: string;
  featured: boolean;
  categoryName: string;
  latestVersion: string | null;
  releaseCount: number;
  downloadCount: number;
  updatedAt: string;
}

export function AdminDashboardClient({
  initialSoftware,
}: {
  initialSoftware: AdminSoftwareRow[];
}) {
  const router = useRouter();
  const [items, setItems] = useState<AdminSoftwareRow[]>(initialSoftware);
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const totalSoftware = items.length;
    const published = items.filter((s) => s.status === "PUBLISHED").length;
    const totalReleases = items.reduce((sum, s) => sum + s.releaseCount, 0);
    const totalDownloads = items.reduce((sum, s) => sum + s.downloadCount, 0);
    return { totalSoftware, published, totalReleases, totalDownloads };
  }, [items]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return items;
    return items.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.slug.toLowerCase().includes(q) ||
        s.categoryName.toLowerCase().includes(q) ||
        s.platform.toLowerCase().includes(q)
    );
  }, [items, search]);

  async function toggleStatus(row: AdminSoftwareRow) {
    const nextStatus = row.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    setBusyId(row.id);
    try {
      const res = await fetch(`/api/admin/software/${row.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        setItems((prev) =>
          prev.map((item) =>
            item.id === row.id ? { ...item, status: nextStatus } : item
          )
        );
        router.refresh();
      }
    } finally {
      setBusyId(null);
    }
  }

  async function toggleFeatured(row: AdminSoftwareRow) {
    const nextFeatured = !row.featured;
    setBusyId(row.id);
    try {
      const res = await fetch(`/api/admin/software/${row.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: nextFeatured }),
      });
      if (res.ok) {
        setItems((prev) =>
          prev.map((item) =>
            item.id === row.id ? { ...item, featured: nextFeatured } : item
          )
        );
        router.refresh();
      }
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(row: AdminSoftwareRow) {
    if (
      !window.confirm(
        `Delete "${row.name}" and all ${row.releaseCount} associated release(s)? This cannot be undone.`
      )
    ) {
      return;
    }

    setBusyId(row.id);
    try {
      const res = await fetch(`/api/admin/software/${row.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.id !== row.id));
        router.refresh();
      }
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Release Distribution Dashboard
          </h1>
          <p className="text-xs text-slate-400">
            Manage software packages, publication states, versions, and
            categorized binaries.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/categories"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:border-slate-700 hover:bg-slate-800"
          >
            <Layers className="h-3.5 w-3.5 text-cyan-400" />
            <span>Manage Categories</span>
          </Link>
          <Link
            href="/admin/software/new"
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-sm shadow-emerald-500/20 hover:bg-emerald-400"
          >
            <Plus className="h-4 w-4" />
            <span>New Software Package</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-800/90 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">
              Total Software
            </span>
            <Package className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-white">
            {stats.totalSoftware}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800/90 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">
              Published Live
            </span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-emerald-400">
            {stats.published}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800/90 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">
              Total Releases
            </span>
            <Tag className="h-4 w-4 text-cyan-400" />
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-cyan-400">
            {stats.totalReleases}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800/90 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">
              Total Downloads
            </span>
            <Download className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-white">
            {stats.totalDownloads.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Searchable Table */}
      <div className="mt-8 rounded-2xl border border-slate-800/90 bg-slate-900/50 p-5">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <h2 className="text-base font-bold text-white">
            Registered Software Packages ({filtered.length})
          </h2>
          <div className="relative sm:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter software by name, slug, or platform..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-emerald-500/60 focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 pr-4 font-semibold">Software</th>
                <th className="pb-3 pr-4 font-semibold">Category / Platform</th>
                <th className="pb-3 pr-4 font-semibold">Latest Version</th>
                <th className="pb-3 pr-4 font-semibold">Status</th>
                <th className="pb-3 pr-4 font-semibold">Featured</th>
                <th className="pb-3 pr-4 font-semibold">Downloads</th>
                <th className="pb-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {filtered.map((row) => (
                <tr key={row.id} className="hover:bg-slate-900/80">
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{row.name}</span>
                      <Link
                        href={`/software/${row.slug}`}
                        target="_blank"
                        className="text-slate-400 hover:text-emerald-400"
                        title="Open Public Detail Page"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                    <p className="font-mono text-[11px] text-slate-400">
                      /{row.slug}
                    </p>
                  </td>

                  <td className="py-3.5 pr-4">
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-cyan-300">
                      {row.categoryName}
                    </span>
                    <div className="mt-1 text-[11px] text-slate-400">
                      {row.platform} • {row.license}
                    </div>
                  </td>

                  <td className="py-3.5 pr-4">
                    {row.latestVersion ? (
                      <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-xs font-semibold text-emerald-400">
                        v{row.latestVersion}
                      </span>
                    ) : (
                      <span className="text-slate-500">No releases</span>
                    )}
                    <div className="mt-1 font-mono text-[11px] text-slate-400">
                      {row.releaseCount} release(s)
                    </div>
                  </td>

                  <td className="py-3.5 pr-4">
                    <button
                      type="button"
                      disabled={busyId === row.id}
                      onClick={() => toggleStatus(row)}
                      title="Click to toggle PUBLISHED / DRAFT"
                      className={`rounded-lg border px-2.5 py-1 font-mono text-[11px] font-semibold transition ${
                        row.status === "PUBLISHED"
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                          : "border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20"
                      }`}
                    >
                      {row.status}
                    </button>
                  </td>

                  <td className="py-3.5 pr-4">
                    <button
                      type="button"
                      disabled={busyId === row.id}
                      onClick={() => toggleFeatured(row)}
                      title="Toggle Featured Flagship status"
                      className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-medium transition ${
                        row.featured
                          ? "border-amber-400/40 bg-amber-400/10 text-amber-300"
                          : "border-slate-800 bg-slate-950 text-slate-400 hover:text-white"
                      }`}
                    >
                      <Star
                        className={`h-3 w-3 ${
                          row.featured ? "fill-amber-300 text-amber-300" : ""
                        }`}
                      />
                      <span>{row.featured ? "Featured" : "Standard"}</span>
                    </button>
                  </td>

                  <td className="py-3.5 pr-4 font-mono text-slate-200">
                    {row.downloadCount.toLocaleString()}
                  </td>

                  <td className="py-3.5 text-right">
                    <div className="inline-flex items-center justify-end gap-1.5">
                      <Link
                        href={`/admin/software/${row.id}/releases`}
                        className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20"
                      >
                        <Tag className="h-3.5 w-3.5" />
                        <span>Releases &amp; Artifacts</span>
                      </Link>
                      <Link
                        href={`/admin/software/${row.id}/edit`}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        <span>Edit</span>
                      </Link>
                      <button
                        type="button"
                        disabled={busyId === row.id}
                        onClick={() => handleDelete(row)}
                        className="inline-flex items-center rounded-lg border border-rose-500/30 bg-rose-500/10 p-1.5 text-rose-300 hover:bg-rose-500/20"
                        title="Delete Software"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

