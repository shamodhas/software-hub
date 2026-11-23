"use client";

import { useEffect, useState } from "react";
import { AdminNav } from "@/components/AdminNav";
import { Layers, Plus, Save, Trash2 } from "lucide-react";

interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  _count?: {
    software: number;
  };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New Category Form
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState(1);

  async function loadCategories() {
    setLoading(true);
    const res = await fetch("/api/admin/categories");
    if (res.ok) {
      const data = await res.json();
      setCategories(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadCategories();
  }, []);

  function handleNameChange(val: string) {
    setName(val);
    setSlug(
      val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
    );
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug, description, sortOrder }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to create category.");
      return;
    }

    setName("");
    setSlug("");
    setDescription("");
    setSortOrder(categories.length + 1);
    await loadCategories();
  }

  async function handleUpdate(cat: AdminCategory) {
    setError(null);
    const res = await fetch(`/api/admin/categories/${cat.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        sortOrder: cat.sortOrder,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to update category.");
      return;
    }
    await loadCategories();
  }

  async function handleDelete(cat: AdminCategory) {
    if (!window.confirm(`Delete category "${cat.name}"?`)) return;
    setError(null);
    const res = await fetch(`/api/admin/categories/${cat.id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to delete category.");
      return;
    }
    await loadCategories();
  }

  return (
    <div>
      <AdminNav />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5">
          <Layers className="h-6 w-6 text-cyan-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">
              Category &amp; Taxonomy Management
            </h1>
            <p className="text-xs text-slate-400">
              Create, reorder, and edit software release categories.
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs font-medium text-rose-300">
            {error}
          </div>
        )}

        {/* Create Category Form */}
        <form
          onSubmit={handleCreate}
          className="mt-6 rounded-2xl border border-slate-800/90 bg-slate-900/60 p-6"
        >
          <h2 className="text-sm font-bold text-white">Create New Category</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div>
              <label className="block text-xs font-medium text-slate-300">
                Category Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g., Desktop Utilities"
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500/60 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300">
                URL Slug *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="desktop-utilities"
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-xs text-white focus:border-emerald-500/60 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300">
                Sort Order
              </label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-xs text-white focus:border-emerald-500/60 focus:outline-none"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400"
              >
                <Plus className="h-4 w-4" />
                <span>Add Category</span>
              </button>
            </div>
          </div>

          <div className="mt-3">
            <label className="block text-xs font-medium text-slate-300">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short summary displayed on the public portal..."
              className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500/60 focus:outline-none"
            />
          </div>
        </form>

        {/* Existing Categories List */}
        <div className="mt-8 space-y-3">
          {loading ? (
            <p className="text-xs text-slate-400">Loading categories...</p>
          ) : (
            categories.map((cat, idx) => (
              <div
                key={cat.id}
                className="rounded-2xl border border-slate-800/90 bg-slate-900/50 p-4"
              >
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-6 sm:items-center">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase text-slate-400">
                      Name
                    </label>
                    <input
                      type="text"
                      value={cat.name}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCategories((prev) =>
                          prev.map((item, i) =>
                            i === idx ? { ...item, name: val } : item
                          )
                        );
                      }}
                      className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-slate-400">
                      Slug
                    </label>
                    <input
                      type="text"
                      value={cat.slug}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCategories((prev) =>
                          prev.map((item, i) =>
                            i === idx ? { ...item, slug: val } : item
                          )
                        );
                      }}
                      className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 font-mono text-xs text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-slate-400">
                      Sort Order
                    </label>
                    <input
                      type="number"
                      value={cat.sortOrder}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setCategories((prev) =>
                          prev.map((item, i) =>
                            i === idx ? { ...item, sortOrder: val } : item
                          )
                        );
                      }}
                      className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 font-mono text-xs text-slate-200"
                    />
                  </div>

                  <div>
                    <span className="block text-[10px] uppercase text-slate-400">
                      Linked Software
                    </span>
                    <span className="mt-1.5 inline-block rounded-md bg-slate-800 px-2.5 py-1 font-mono text-xs text-emerald-400">
                      {cat._count?.software ?? 0} package(s)
                    </span>
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleUpdate(cat)}
                      className="inline-flex items-center gap-1 rounded-xl bg-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/30"
                    >
                      <Save className="h-3.5 w-3.5" />
                      <span>Save</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(cat)}
                      className="inline-flex items-center rounded-xl border border-rose-500/30 bg-rose-500/10 p-1.5 text-rose-300 hover:bg-rose-500/20"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="mt-2">
                  <input
                    type="text"
                    value={cat.description || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCategories((prev) =>
                        prev.map((item, i) =>
                          i === idx ? { ...item, description: val } : item
                        )
                      );
                    }}
                    placeholder="Category description..."
                    className="w-full rounded-lg border border-slate-800/80 bg-slate-950/60 px-2.5 py-1.5 text-xs text-slate-300"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

