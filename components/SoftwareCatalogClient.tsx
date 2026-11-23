"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Download,
  ExternalLink,
  Sparkles,
  Terminal,
  Smartphone,
  ShieldCheck,
  Package,
  Layers,
  Cpu,
  Scale,
  Github,
  ArrowRight,
  Code2,
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";

export interface ArtifactItem {
  id: string;
  artifactType: string;
  label: string;
  fileName: string | null;
  fileSize: string | null;
  sha256: string | null;
  downloadUrl: string;
  downloadCount: number;
}

export interface ReleaseItem {
  id: string;
  version: string;
  releaseTitle: string | null;
  channel: string;
  isLatest: boolean;
  releaseDate: string;
  changelog: string;
  githubTagUrl: string | null;
  artifacts: ArtifactItem[];
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
}

export interface SoftwareItem {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  platform: string;
  license: string;
  status: string;
  featured: boolean;
  githubRepoUrl: string | null;
  githubReleasesUrl: string | null;
  docsUrl: string | null;
  iconName: string | null;
  category: CategoryItem;
  releases: ReleaseItem[];
}

function DynamicIcon({
  name,
  className,
}: {
  name: string | null;
  className?: string;
}) {
  switch (name) {
    case "Smartphone":
      return <Smartphone className={className} />;
    case "Terminal":
      return <Terminal className={className} />;
    case "ShieldCheck":
      return <ShieldCheck className={className} />;
    case "Code2":
      return <Code2 className={className} />;
    default:
      return <Package className={className} />;
  }
}

function getPrimaryArtifact(release?: ReleaseItem): ArtifactItem | undefined {
  if (!release || release.artifacts.length === 0) return undefined;
  const priority = [
    "EXECUTABLE",
    "PORTABLE_ZIP",
    "PACKAGE_REGISTRY",
    "SOURCE_ARCHIVE",
    "GITHUB_SOURCE",
  ];
  for (const type of priority) {
    const found = release.artifacts.find((a) => a.artifactType === type);
    if (found) return found;
  }
  return release.artifacts[0];
}

function getTotalSoftwareDownloads(sw: SoftwareItem): number {
  return sw.releases.reduce(
    (acc, rel) =>
      acc + rel.artifacts.reduce((sum, art) => sum + art.downloadCount, 0),
    0
  );
}

export function SoftwareCatalogClient({
  software,
  categories,
  initialCategory = "all",
}: {
  software: SoftwareItem[];
  categories: CategoryItem[];
  initialCategory?: string;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedPlatform, setSelectedPlatform] = useState("all");

  const platforms = useMemo(() => {
    const set = new Set<string>();
    software.forEach((s) => {
      if (s.platform) set.add(s.platform);
    });
    return Array.from(set);
  }, [software]);

  const filteredSoftware = useMemo(() => {
    return software.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.tagline.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.platform.toLowerCase().includes(q) ||
        item.category.name.toLowerCase().includes(q);

      const matchesCategory =
        selectedCategory === "all" || item.category.slug === selectedCategory;

      const matchesPlatform =
        selectedPlatform === "all" || item.platform === selectedPlatform;

      return matchesSearch && matchesCategory && matchesPlatform;
    });
  }, [software, searchQuery, selectedCategory, selectedPlatform]);

  const featuredSoftware = useMemo(
    () => software.filter((s) => s.featured),
    [software]
  );

  const totalDownloads = useMemo(
    () => software.reduce((sum, s) => sum + getTotalSoftwareDownloads(s), 0),
    [software]
  );

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-800/80 bg-gradient-to-b from-slate-900/70 via-slate-950 to-slate-950 py-16 sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/10 via-cyan-500/5 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-emerald-500/30 bg-slate-900/90 py-1 pl-1.5 pr-4 text-xs font-medium text-emerald-300 shadow-sm">
              <BrandLogo size="sm" />
              <span>
                Official Release Registry &amp; Open-Source Distribution Portal
              </span>
            </div>

            <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              Production Binaries, CLI Toolchains &amp;{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Open-Source Releases
              </span>
            </h1>

            <p className="mt-4 text-base leading-relaxed text-slate-300 sm:text-lg">
              Download verified standalone executables, source code archives,
              and package registry releases engineered by{" "}
              <a
                href="https://shamodha.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-emerald-400 underline decoration-emerald-500/40 underline-offset-4 hover:text-emerald-300"
              >
                Shamodha Sahan
              </a>
              .
            </p>

            {/* Quick Metrics Bar */}
            <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-6 rounded-2xl border border-slate-800/90 bg-slate-900/70 px-6 py-3 text-xs text-slate-300 backdrop-blur">
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-bold text-emerald-400">
                  {software.length}
                </span>
                <span>Published Packages</span>
              </div>
              <span className="text-slate-700">•</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-bold text-cyan-400">
                  {software.reduce((acc, s) => acc + s.releases.length, 0)}
                </span>
                <span>Tagged Releases</span>
              </div>
              <span className="text-slate-700">•</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-bold text-emerald-400">
                  {totalDownloads.toLocaleString()}
                </span>
                <span>Total Artifact Downloads</span>
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="mx-auto mt-10 max-w-4xl rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl shadow-black/40 backdrop-blur">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search software, executables, CLI packages, or keywords (e.g., Android Mirror, JWT, Node)..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-emerald-500/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="sm:w-56">
                <select
                  aria-label="Filter by Platform"
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-200 focus:border-emerald-500/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="all">All Platforms ({platforms.length})</option>
                  {platforms.map((platform) => (
                    <option key={platform} value={platform}>
                      {platform}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="mt-3.5 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  selectedCategory === "all"
                    ? "bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/20"
                    : "border border-slate-800 bg-slate-950/70 text-slate-300 hover:border-slate-700 hover:text-white"
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    selectedCategory === cat.slug
                      ? "bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/20"
                      : "border border-slate-800 bg-slate-950/70 text-slate-300 hover:border-slate-700 hover:text-white"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Flagship Spotlight (Shown when not actively filtering down) */}
      {featuredSoftware.length > 0 &&
        !searchQuery &&
        selectedCategory === "all" &&
        selectedPlatform === "all" && (
          <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
                  Featured Flagship Releases
                </h2>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-3">
              {featuredSoftware.slice(0, 3).map((item) => {
                const latestRelease =
                  item.releases.find((r) => r.isLatest) || item.releases[0];
                const primaryArtifact = getPrimaryArtifact(latestRelease);
                const downloads = getTotalSoftwareDownloads(item);

                return (
                  <div
                    key={item.id}
                    className="group relative flex flex-col justify-between rounded-2xl border border-emerald-500/25 bg-gradient-to-b from-slate-900/90 to-slate-950 p-6 shadow-lg transition hover:border-emerald-500/50"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                            <DynamicIcon
                              name={item.iconName}
                              className="h-5 w-5"
                            />
                          </div>
                          <div>
                            <Link
                              href={`/software/${item.slug}`}
                              className="text-lg font-bold text-white transition group-hover:text-emerald-400"
                            >
                              {item.name}
                            </Link>
                            <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                              <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-300">
                                {item.category.name}
                              </span>
                              {latestRelease && (
                                <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-emerald-400">
                                  v{latestRelease.version}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-slate-300">
                        {item.tagline}
                      </p>

                      {/* Metadata Pills */}
                      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                        <span className="inline-flex items-center gap-1 rounded-md border border-slate-800 bg-slate-900/80 px-2 py-1">
                          <Cpu className="h-3.5 w-3.5 text-cyan-400" />
                          {item.platform}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-md border border-slate-800 bg-slate-900/80 px-2 py-1">
                          <Scale className="h-3.5 w-3.5 text-emerald-400" />
                          {item.license}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-md border border-slate-800 bg-slate-900/80 px-2 py-1 font-mono">
                          <Download className="h-3.5 w-3.5 text-emerald-400" />
                          {downloads.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-2 border-t border-slate-800/80 pt-4 sm:flex-row">
                      {primaryArtifact ? (
                        <a
                          href={`/api/download/${primaryArtifact.id}`}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-semibold text-slate-950 shadow-sm shadow-emerald-500/20 transition hover:bg-emerald-400"
                        >
                          <Download className="h-4 w-4" />
                          <span className="truncate">
                            {primaryArtifact.artifactType === "EXECUTABLE"
                              ? `Download ${primaryArtifact.fileName || "Executable"}`
                              : primaryArtifact.label}
                          </span>
                        </a>
                      ) : (
                        <Link
                          href={`/software/${item.slug}`}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-semibold text-slate-950 transition hover:bg-emerald-400"
                        >
                          <span>View Releases</span>
                        </Link>
                      )}

                      <Link
                        href={`/software/${item.slug}`}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-xs font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white"
                      >
                        <span>Details &amp; Source</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

      {/* Main Filterable Software Directory */}
      <section
        id="catalog"
        className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col justify-between gap-2 border-b border-slate-800/80 pb-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold text-white">
              Software &amp; Release Directory
            </h2>
            <p className="text-xs text-slate-400">
              Showing {filteredSoftware.length} of {software.length} published
              software distributions
            </p>
          </div>
          {(searchQuery ||
            selectedCategory !== "all" ||
            selectedPlatform !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedPlatform("all");
              }}
              className="self-start rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-emerald-400 hover:bg-slate-800 sm:self-auto"
            >
              Reset Filters
            </button>
          )}
        </div>

        {filteredSoftware.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-12 text-center">
            <Package className="mx-auto h-10 w-10 text-slate-500" />
            <h3 className="mt-3 text-base font-semibold text-white">
              No matching software releases found
            </h3>
            <p className="mt-1 text-sm text-slate-400">
              Try clearing your search query or switching category and platform
              filters.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            {filteredSoftware.map((item) => {
              const latestRelease =
                item.releases.find((r) => r.isLatest) || item.releases[0];
              const primaryArtifact = getPrimaryArtifact(latestRelease);
              const downloads = getTotalSoftwareDownloads(item);

              return (
                <article
                  key={item.id}
                  className="flex flex-col justify-between rounded-2xl border border-slate-800/90 bg-slate-900/60 p-6 transition hover:border-slate-700"
                >
                  <div>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-center gap-3.5">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-700/80 bg-slate-950 text-emerald-400">
                          <DynamicIcon
                            name={item.iconName}
                            className="h-6 w-6"
                          />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <Link
                              href={`/software/${item.slug}`}
                              className="text-lg font-bold text-white hover:text-emerald-400"
                            >
                              {item.name}
                            </Link>
                            {latestRelease && (
                              <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-xs font-semibold text-emerald-400">
                                v{latestRelease.version}
                              </span>
                            )}
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                            <span className="rounded bg-slate-800 px-2 py-0.5 font-medium text-cyan-300">
                              {item.category.name}
                            </span>
                            <span>•</span>
                            <span>{item.platform}</span>
                            <span>•</span>
                            <span>License: {item.license}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-relaxed text-slate-300">
                      {item.tagline}
                    </p>

                    {/* Categorized Artifacts Preview Chips */}
                    {latestRelease && latestRelease.artifacts.length > 0 && (
                      <div className="mt-4 flex flex-wrap items-center gap-1.5">
                        {latestRelease.artifacts.map((art) => (
                          <span
                            key={art.id}
                            className="inline-flex items-center gap-1 rounded-md border border-slate-800 bg-slate-950/80 px-2 py-0.5 font-mono text-[11px] text-slate-400"
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                art.artifactType === "EXECUTABLE"
                                  ? "bg-emerald-400"
                                  : art.artifactType === "SOURCE_ARCHIVE"
                                  ? "bg-violet-400"
                                  : art.artifactType === "PACKAGE_REGISTRY"
                                  ? "bg-amber-400"
                                  : "bg-cyan-400"
                              }`}
                            />
                            {art.artifactType}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-4">
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="font-mono">
                        {downloads.toLocaleString()} downloads
                      </span>
                      {item.githubRepoUrl && (
                        <a
                          href={item.githubRepoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-slate-300 hover:text-emerald-400"
                        >
                          <Github className="h-3.5 w-3.5" />
                          <span>Repo ↗</span>
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {primaryArtifact && (
                        <a
                          href={`/api/download/${primaryArtifact.id}`}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3.5 py-2 text-xs font-semibold text-slate-950 transition hover:bg-emerald-400"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>
                            {primaryArtifact.fileName || "Primary Download"}
                          </span>
                        </a>
                      )}
                      <Link
                        href={`/software/${item.slug}`}
                        className="inline-flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
                      >
                        <span>Details &amp; Source</span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Categories Section */}
      <section
        id="categories"
        className="border-t border-slate-800/80 bg-slate-900/30 py-12"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">
              Browse by Distribution Category
            </h2>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => {
              const count = software.filter(
                (s) => s.category.slug === cat.slug
              ).length;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.slug);
                    document
                      .getElementById("catalog")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="flex flex-col justify-between rounded-2xl border border-slate-800/90 bg-slate-950/80 p-5 text-left transition hover:border-emerald-500/40"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">
                        {cat.name}
                      </span>
                      <span className="rounded-full border border-slate-800 bg-slate-900 px-2.5 py-0.5 font-mono text-xs text-emerald-400">
                        {count}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-slate-400">
                      {cat.description ||
                        "Curated releases and open-source tools."}
                    </p>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-emerald-400">
                    Filter category →
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

