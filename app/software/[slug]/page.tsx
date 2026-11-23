import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Github,
  ExternalLink,
  Cpu,
  Scale,
  Calendar,
  CheckCircle2,
  Terminal,
  FileArchive,
  Package,
  FileCode2,
  Layers,
  Tag,
  BookOpen,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import {
  OWNER_NAME,
  OWNER_PORTFOLIO_URL,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";
import { CopyShaButton } from "@/components/CopyShaButton";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const software = await prisma.software.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      releases: {
        orderBy: [{ isLatest: "desc" }, { releaseDate: "desc" }],
        take: 1,
      },
    },
  });

  if (!software || software.status !== "PUBLISHED") {
    return {
      title: "Software Not Found",
    };
  }

  const latestVersion = software.releases[0]?.version || "1.0.0";
  const title = `${software.name} v${latestVersion} — Download & Source Releases`;
  const description = `${software.tagline} Download verified ${software.platform} binaries, source code archives, and official releases on ${SITE_NAME}.`;
  const canonicalUrl = `${SITE_URL}/software/${software.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      title: `${title} | ${SITE_NAME}`,
      description,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
    },
  };
}

interface ArtifactRecord {
  id: string;
  artifactType: string;
  label: string;
  fileName: string | null;
  fileSize: string | null;
  sha256: string | null;
  downloadUrl: string;
  downloadCount: number;
}

const ARTIFACT_GROUPS = [
  {
    key: "BINARIES",
    types: ["EXECUTABLE", "PORTABLE_ZIP"],
    title: "Compiled Executable / Binary",
    subtitle: "Ready-to-run standalone installer, binary executable, or portable package",
    badgeClass:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    buttonClass:
      "bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-sm shadow-emerald-500/20",
    Icon: Cpu,
  },
  {
    key: "PACKAGE_REGISTRY",
    types: ["PACKAGE_REGISTRY"],
    title: "Package Registry",
    subtitle: "Managed distribution via NPM, Maven Central, or PyPI",
    badgeClass: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    buttonClass:
      "border border-amber-500/40 bg-amber-500/15 text-amber-200 hover:bg-amber-500/25",
    Icon: Package,
  },
  {
    key: "SOURCE_ARCHIVE",
    types: ["SOURCE_ARCHIVE"],
    title: "Source Code Archive",
    subtitle: "Immutable release snapshot archive (.zip / .tar.gz)",
    badgeClass: "border-violet-500/30 bg-violet-500/10 text-violet-300",
    buttonClass:
      "border border-slate-700 bg-slate-900 text-slate-100 hover:border-slate-600 hover:bg-slate-800",
    Icon: FileArchive,
  },
  {
    key: "GITHUB_SOURCE",
    types: ["GITHUB_SOURCE"],
    title: "GitHub Source & Releases",
    subtitle: "Direct link to GitHub repository tree and release tags",
    badgeClass: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
    buttonClass:
      "border border-slate-700 bg-slate-900 text-slate-100 hover:border-slate-600 hover:bg-slate-800",
    Icon: FileCode2,
  },
];

function ArtifactMatrix({ artifacts }: { artifacts: ArtifactRecord[] }) {
  if (artifacts.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 text-sm text-slate-400">
        No downloadable artifacts registered for this release yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {ARTIFACT_GROUPS.map((group) => {
        const groupArtifacts = artifacts.filter((a) =>
          group.types.includes(a.artifactType)
        );
        if (groupArtifacts.length === 0) return null;

        const IconComponent = group.Icon;

        return (
          <div
            key={group.key}
            className="flex flex-col justify-between rounded-2xl border border-slate-800/90 bg-slate-900/70 p-5"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl border ${group.badgeClass}`}
                  >
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {group.title}
                    </h4>
                    <p className="text-xs text-slate-400">{group.subtitle}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {groupArtifacts.map((art) => (
                  <div
                    key={art.id}
                    className="rounded-xl border border-slate-800/90 bg-slate-950/80 p-3.5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold text-slate-100">
                            {art.label}
                          </span>
                          <span
                            className={`rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase ${group.badgeClass}`}
                          >
                            {art.artifactType}
                          </span>
                        </div>

                        <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                          {art.fileName && (
                            <span className="font-mono text-slate-300">
                              {art.fileName}
                            </span>
                          )}
                          {art.fileSize && (
                            <span className="rounded bg-slate-900 px-1.5 py-0.5 font-mono">
                              {art.fileSize}
                            </span>
                          )}
                          <span className="font-mono text-emerald-400/90">
                            {art.downloadCount.toLocaleString()} downloads
                          </span>
                        </div>
                      </div>

                      <a
                        href={`/api/download/${art.id}`}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${group.buttonClass}`}
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>
                          {art.artifactType === "GITHUB_SOURCE"
                            ? "Open GitHub Source"
                            : art.artifactType === "PACKAGE_REGISTRY"
                            ? "Open Package"
                            : "Download"}
                        </span>
                      </a>
                    </div>

                    {art.sha256 && (
                      <div className="mt-2.5 border-t border-slate-800/80 pt-2.5">
                        <CopyShaButton sha256={art.sha256} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default async function SoftwareDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const software = await prisma.software.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      releases: {
        orderBy: [{ isLatest: "desc" }, { releaseDate: "desc" }],
        include: {
          artifacts: true,
        },
      },
    },
  });

  if (!software || software.status !== "PUBLISHED") {
    notFound();
  }

  const latestRelease =
    software.releases.find((r) => r.isLatest) || software.releases[0];
  const olderReleases = software.releases.filter(
    (r) => r.id !== latestRelease?.id
  );

  const totalDownloads = software.releases.reduce(
    (acc, rel) =>
      acc + rel.artifacts.reduce((sum, a) => sum + a.downloadCount, 0),
    0
  );

  const primaryArtifact =
    latestRelease?.artifacts.find((a) => a.artifactType === "EXECUTABLE") ||
    latestRelease?.artifacts[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: software.name,
    headline: software.tagline,
    description: software.description,
    operatingSystem: software.platform,
    applicationCategory: software.category.name,
    softwareVersion: latestRelease?.version || "1.0.0",
    license: software.license,
    url: `${SITE_URL}/software/${software.slug}`,
    downloadUrl: primaryArtifact
      ? `${SITE_URL}/api/download/${primaryArtifact.id}`
      : `${SITE_URL}/software/${software.slug}`,
    author: {
      "@type": "Person",
      name: OWNER_NAME,
      url: OWNER_PORTFOLIO_URL,
    },
    offers: {
      "@type": "Offer",
      price: "0.00",
      priceCurrency: "USD",
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-emerald-400"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Software Releases</span>
        </Link>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Category:</span>
          <Link
            href={`/?category=${software.category.slug}#catalog`}
            className="rounded-md border border-slate-800 bg-slate-900 px-2.5 py-1 font-medium text-cyan-300 hover:border-cyan-500/40"
          >
            {software.category.name}
          </Link>
        </div>
      </div>

      {/* Software Header Hero Card */}
      <div className="mt-6 rounded-3xl border border-slate-800/90 bg-gradient-to-b from-slate-900/90 to-slate-950 p-6 shadow-xl sm:p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-xs font-semibold text-cyan-300">
                {software.category.name}
              </span>
              {latestRelease && (
                <span className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 font-mono text-xs font-bold text-emerald-400">
                  v{latestRelease.version} ({latestRelease.channel})
                </span>
              )}
              <span className="rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs text-slate-300">
                {software.platform}
              </span>
              <span className="rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs text-slate-300">
                License: {software.license}
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {software.name}
            </h1>
            <p className="mt-3 text-base leading-relaxed text-slate-300 sm:text-lg">
              {software.tagline}
            </p>

            {/* Quick Meta Row */}
            <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <Cpu className="h-4 w-4 text-cyan-400" />
                <span>Platform: {software.platform}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Scale className="h-4 w-4 text-emerald-400" />
                <span>License: {software.license}</span>
              </span>
              {latestRelease && (
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-emerald-400" />
                  <span>
                    Released:{" "}
                    {new Date(latestRelease.releaseDate).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </span>
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 font-mono text-emerald-400">
                <Download className="h-4 w-4" />
                <span>{totalDownloads.toLocaleString()} total downloads</span>
              </span>
            </div>
          </div>

          {/* Primary Action Stack */}
          <div className="flex flex-col gap-2.5 sm:min-w-[260px]">
            {primaryArtifact && (
              <a
                href={`/api/download/${primaryArtifact.id}`}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400"
              >
                <Download className="h-4 w-4" />
                <span>
                  {primaryArtifact.fileName
                    ? `Download ${primaryArtifact.fileName}`
                    : primaryArtifact.label}
                </span>
              </a>
            )}

            <div className="grid grid-cols-2 gap-2">
              {software.githubRepoUrl && (
                <a
                  href={software.githubRepoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-xs font-semibold text-slate-200 transition hover:border-slate-700 hover:bg-slate-800"
                >
                  <Github className="h-3.5 w-3.5" />
                  <span>GitHub Repo ↗</span>
                </a>
              )}
              {software.githubReleasesUrl && (
                <a
                  href={software.githubReleasesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-xs font-semibold text-slate-200 transition hover:border-slate-700 hover:bg-slate-800"
                >
                  <Tag className="h-3.5 w-3.5 text-emerald-400" />
                  <span>All Tags ↗</span>
                </a>
              )}
            </div>

            {software.docsUrl && (
              <a
                href={software.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-800/80 bg-slate-950 px-3 py-2 text-xs font-medium text-cyan-300 transition hover:border-cyan-500/40"
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>Documentation &amp; Readme</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Categorized Artifact Matrix for Latest Release */}
      {latestRelease && (
        <section className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-emerald-400" />
                <h2 className="text-xl font-bold text-white">
                  Categorized Release Artifacts — v{latestRelease.version}
                </h2>
                <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-xs font-semibold text-emerald-400">
                  LATEST {latestRelease.channel}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                Every artifact is strictly categorized into Standalone
                Binaries, Source Code Archives, Package Registries, or GitHub
                Source Trees.
              </p>
            </div>

            {latestRelease.githubTagUrl && (
              <a
                href={latestRelease.githubTagUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-slate-700 hover:text-white"
              >
                <Github className="h-3.5 w-3.5" />
                <span>GitHub Tag v{latestRelease.version} ↗</span>
              </a>
            )}
          </div>

          <div className="mt-5">
            <ArtifactMatrix artifacts={latestRelease.artifacts} />
          </div>
        </section>
      )}

      {/* Overview, System Requirements & Quick-Start Steps */}
      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Overview & Architecture Description */}
        <div className="space-y-8 lg:col-span-2">
          <section className="rounded-2xl border border-slate-800/90 bg-slate-900/50 p-6">
            <h2 className="text-lg font-bold text-white">
              Software Overview &amp; Highlights
            </h2>
            <div className="mt-4 whitespace-pre-line text-sm leading-relaxed text-slate-300">
              {software.description}
            </div>
          </section>

          {/* Quick-Start Setup Steps */}
          {software.setupSteps.length > 0 && (
            <section className="rounded-2xl border border-slate-800/90 bg-slate-900/50 p-6">
              <div className="flex items-center gap-2">
                <Terminal className="h-5 w-5 text-emerald-400" />
                <h2 className="text-lg font-bold text-white">
                  Quick-Start &amp; Installation Steps
                </h2>
              </div>
              <ol className="mt-4 space-y-3">
                {software.setupSteps.map((step, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3.5 rounded-xl border border-slate-800/80 bg-slate-950/70 p-4"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-500/10 font-mono text-xs font-bold text-emerald-400">
                      {index + 1}
                    </span>
                    <span className="text-sm leading-relaxed text-slate-200">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>

        {/* System Requirements Sidebar */}
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-800/90 bg-slate-900/50 p-6">
            <h2 className="text-base font-bold text-white">
              System Requirements
            </h2>
            {software.requirements.length === 0 ? (
              <p className="mt-3 text-xs text-slate-400">
                Standard {software.platform} runtime environment.
              </p>
            ) : (
              <ul className="mt-4 space-y-2.5">
                {software.requirements.map((req, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-sm text-slate-300"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-2xl border border-slate-800/90 bg-slate-900/50 p-6">
            <h2 className="text-base font-bold text-white">
              Package Provenance
            </h2>
            <dl className="mt-4 space-y-3 text-xs">
              <div className="flex justify-between border-b border-slate-800/70 pb-2">
                <dt className="text-slate-400">Author / Maintainer</dt>
                <dd className="font-medium text-white">
                  <a
                    href={OWNER_PORTFOLIO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:underline"
                  >
                    {OWNER_NAME} ↗
                  </a>
                </dd>
              </div>
              <div className="flex justify-between border-b border-slate-800/70 pb-2">
                <dt className="text-slate-400">Target Platform</dt>
                <dd className="font-mono text-slate-200">
                  {software.platform}
                </dd>
              </div>
              <div className="flex justify-between border-b border-slate-800/70 pb-2">
                <dt className="text-slate-400">License</dt>
                <dd className="font-mono text-emerald-400">
                  {software.license}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">Total Releases</dt>
                <dd className="font-mono text-slate-200">
                  {software.releases.length}
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </div>

      {/* Version History & Changelog Section */}
      <section className="mt-12 border-t border-slate-800/80 pt-10">
        <h2 className="text-xl font-bold text-white">
          Version History &amp; Release Notes
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Complete release timeline, changelogs, and historical downloadable
          artifacts for {software.name}.
        </p>

        <div className="mt-6 space-y-6">
          {latestRelease && (
            <div className="rounded-2xl border border-emerald-500/30 bg-slate-900/60 p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-2.5 py-1 font-mono text-sm font-bold text-emerald-300">
                    v{latestRelease.version}
                  </span>
                  <span className="rounded bg-emerald-500 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-slate-950">
                    Latest
                  </span>
                  <span className="rounded border border-slate-700 bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-slate-300">
                    {latestRelease.channel}
                  </span>
                  {latestRelease.releaseTitle && (
                    <span className="text-sm font-semibold text-white">
                      {latestRelease.releaseTitle}
                    </span>
                  )}
                </div>
                <span className="font-mono text-xs text-slate-400">
                  {new Date(latestRelease.releaseDate).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }
                  )}
                </span>
              </div>

              <div className="mt-4 whitespace-pre-line rounded-xl border border-slate-800/80 bg-slate-950/70 p-4 font-mono text-xs leading-relaxed text-slate-300">
                {latestRelease.changelog}
              </div>
            </div>
          )}

          {/* Expandable Older Versions */}
          {olderReleases.map((rel) => (
            <details
              key={rel.id}
              className="group rounded-2xl border border-slate-800/90 bg-slate-900/40 p-5"
            >
              <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 font-mono text-xs font-bold text-slate-200">
                    v{rel.version}
                  </span>
                  <span className="rounded border border-slate-800 bg-slate-950 px-2 py-0.5 font-mono text-[10px] text-slate-400">
                    {rel.channel}
                  </span>
                  {rel.releaseTitle && (
                    <span className="text-sm font-semibold text-slate-200">
                      {rel.releaseTitle}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-slate-400">
                    {new Date(rel.releaseDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="text-xs font-medium text-emerald-400 group-open:underline">
                    Toggle Release &amp; Artifacts ({rel.artifacts.length})
                  </span>
                </div>
              </summary>

              <div className="mt-5 space-y-5 border-t border-slate-800/80 pt-4">
                <div className="whitespace-pre-line rounded-xl border border-slate-800/80 bg-slate-950/70 p-4 font-mono text-xs leading-relaxed text-slate-300">
                  {rel.changelog}
                </div>
                <ArtifactMatrix artifacts={rel.artifacts} />
              </div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

