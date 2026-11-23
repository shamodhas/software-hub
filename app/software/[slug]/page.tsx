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
  CANONICAL_SITE_URL,
  OWNER_EMAIL,
  OWNER_FULL_NAME,
  OWNER_GITHUB_URL,
  OWNER_LOCATION,
  OWNER_NAME,
  OWNER_PORTFOLIO_URL,
  SITE_NAME,
} from "@/lib/site";
import { CopyShaButton } from "@/components/CopyShaButton";
import { AdSlot } from "@/components/AdSlot";

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
  const description = `${software.tagline} Download verified ${software.platform} binaries, source code archives, and official releases by ${OWNER_NAME} on ${SITE_NAME}.`;
  const canonicalUrl = `${CANONICAL_SITE_URL}/software/${software.slug}`;

  return {
    title,
    description,
    keywords: [
      software.name,
      `${software.name} v${latestVersion}`,
      software.category.name,
      software.platform,
      software.license,
      OWNER_NAME,
      OWNER_FULL_NAME,
      SITE_NAME,
    ],
    authors: [{ name: OWNER_NAME, url: OWNER_PORTFOLIO_URL }],
    creator: OWNER_NAME,
    publisher: OWNER_NAME,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      title: `${title} | ${SITE_NAME}`,
      description,
      siteName: SITE_NAME,
      images: [
        {
          url: "/images/logo-blue-removebg.png",
          width: 512,
          height: 512,
          alt: `${software.name} v${latestVersion} — ${SITE_NAME}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: ["/images/logo-blue-removebg.png"],
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
    subtitle:
      "Ready-to-run standalone installer, binary executable, or portable package",
    badgeClass: "brand-badge",
    buttonClass: "brand-btn-primary",
    Icon: Cpu,
  },
  {
    key: "PACKAGE_REGISTRY",
    types: ["PACKAGE_REGISTRY"],
    title: "Package Registry",
    subtitle: "Managed distribution via NPM, Maven Central, or PyPI",
    badgeClass: "border-amber-500/35 bg-amber-500/10 text-amber-300",
    buttonClass:
      "border border-amber-500/40 bg-amber-500/15 text-amber-200 hover:bg-amber-500/25",
    Icon: Package,
  },
  {
    key: "SOURCE_ARCHIVE",
    types: ["SOURCE_ARCHIVE"],
    title: "Source Code Archive",
    subtitle: "Immutable release snapshot archive (.zip / .tar.gz)",
    badgeClass: "border-purple-500/35 bg-purple-500/10 text-purple-300",
    buttonClass:
      "border border-slate-700 bg-[#0D1424] text-slate-100 hover:border-brand-border hover:bg-[#131D33]",
    Icon: FileArchive,
  },
  {
    key: "GITHUB_SOURCE",
    types: ["GITHUB_SOURCE"],
    title: "GitHub Source & Releases",
    subtitle: "Direct link to GitHub repository tree and release tags",
    badgeClass: "border-sky-500/35 bg-sky-500/10 text-sky-300",
    buttonClass:
      "border border-slate-700 bg-[#0D1424] text-slate-100 hover:border-brand-border hover:bg-[#131D33]",
    Icon: FileCode2,
  },
];

function ArtifactMatrix({ artifacts }: { artifacts: ArtifactRecord[] }) {
  if (artifacts.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-[#0D1424]/70 p-6 text-sm text-[#94A3B8]">
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
            className="brand-surface-card flex flex-col justify-between rounded-2xl p-5"
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
                    <h4 className="text-sm font-bold text-[#F8FAFC]">
                      {group.title}
                    </h4>
                    <p className="text-xs text-[#94A3B8]">{group.subtitle}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {groupArtifacts.map((art) => (
                  <div
                    key={art.id}
                    className="rounded-xl border border-slate-800/90 bg-[#060B14] p-3.5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold text-[#F8FAFC]">
                            {art.label}
                          </span>
                          <span
                            className={`rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase ${group.badgeClass}`}
                          >
                            {art.artifactType}
                          </span>
                        </div>

                        <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-[#94A3B8]">
                          {art.fileName && (
                            <span className="font-mono text-slate-300">
                              {art.fileName}
                            </span>
                          )}
                          {art.fileSize && (
                            <span className="rounded bg-[#0D1424] px-1.5 py-0.5 font-mono">
                              {art.fileSize}
                            </span>
                          )}
                          <span className="brand-text font-mono">
                            {art.downloadCount.toLocaleString()} downloads
                          </span>
                        </div>
                      </div>

                      <a
                        href={`/api/download/${art.id}`}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${group.buttonClass}`}
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

  const canonicalSoftwareUrl = `${CANONICAL_SITE_URL}/software/${software.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${canonicalSoftwareUrl}#software`,
    name: software.name,
    headline: software.tagline,
    description: software.description,
    operatingSystem: software.platform,
    applicationCategory: software.category.name,
    softwareVersion: latestRelease?.version || "1.0.0",
    releaseNotes: latestRelease?.changelog || undefined,
    datePublished: latestRelease
      ? latestRelease.releaseDate.toISOString()
      : software.createdAt.toISOString(),
    dateModified: software.updatedAt.toISOString(),
    license: software.license,
    url: canonicalSoftwareUrl,
    codeRepository: software.githubRepoUrl || undefined,
    softwareRequirements:
      software.requirements.length > 0
        ? software.requirements.join("; ")
        : undefined,
    downloadUrl: primaryArtifact
      ? `${CANONICAL_SITE_URL}/api/download/${primaryArtifact.id}`
      : canonicalSoftwareUrl,
    fileSize: primaryArtifact?.fileSize || undefined,
    author: {
      "@type": "Person",
      name: OWNER_NAME,
      alternateName: OWNER_FULL_NAME,
      url: OWNER_PORTFOLIO_URL,
      email: `mailto:${OWNER_EMAIL}`,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Panadura",
        addressCountry: "LK",
        description: OWNER_LOCATION,
      },
      sameAs: [OWNER_PORTFOLIO_URL, OWNER_GITHUB_URL],
    },
    publisher: {
      "@type": "Person",
      name: OWNER_NAME,
      url: OWNER_PORTFOLIO_URL,
    },
    isPartOf: {
      "@type": "WebSite",
      "@id": `${CANONICAL_SITE_URL}/#website`,
      name: SITE_NAME,
      url: CANONICAL_SITE_URL,
    },
    offers: {
      "@type": "Offer",
      price: "0.00",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
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
          className="inline-flex items-center gap-2 text-sm font-medium text-[#94A3B8] transition hover:text-brand-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Software Releases</span>
        </Link>

        <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
          <span>Category:</span>
          <Link
            href={`/?category=${software.category.slug}#catalog`}
            className="brand-badge rounded-md px-2.5 py-1 font-medium"
          >
            {software.category.name}
          </Link>
        </div>
      </div>

      {/* Software Header Hero Card */}
      <div className="brand-card-featured mt-6 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="rounded-lg border border-slate-700 bg-[#0D1424] px-2.5 py-1 text-xs font-semibold text-slate-200">
                {software.category.name}
              </span>
              {latestRelease && (
                <span className="brand-badge rounded-lg px-2.5 py-1 font-mono text-xs font-bold">
                  v{latestRelease.version} ({latestRelease.channel})
                </span>
              )}
              <span className="rounded-lg border border-slate-800 bg-[#060B14] px-2.5 py-1 text-xs text-slate-300">
                {software.platform}
              </span>
              <span className="rounded-lg border border-slate-800 bg-[#060B14] px-2.5 py-1 text-xs text-slate-300">
                License: {software.license}
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#F8FAFC] sm:text-4xl">
              {software.name}
            </h1>
            <p className="mt-3 text-base leading-relaxed text-slate-300 sm:text-lg">
              {software.tagline}
            </p>

            {/* Quick Meta Row */}
            <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-[#94A3B8]">
              <span className="inline-flex items-center gap-1.5">
                <Cpu className="brand-text-secondary h-4 w-4" />
                <span>Platform: {software.platform}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Scale className="brand-text h-4 w-4" />
                <span>License: {software.license}</span>
              </span>
              {latestRelease && (
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="brand-text h-4 w-4" />
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
              <span className="brand-text inline-flex items-center gap-1.5 font-mono">
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
                className="brand-btn-primary inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-bold"
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
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-[#0D1424] px-3 py-2.5 text-xs font-semibold text-slate-200 transition hover:border-brand-border hover:bg-[#131D33]"
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
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-[#0D1424] px-3 py-2.5 text-xs font-semibold text-slate-200 transition hover:border-brand-border hover:bg-[#131D33]"
                >
                  <Tag className="brand-text h-3.5 w-3.5" />
                  <span>All Tags ↗</span>
                </a>
              )}
            </div>

            {software.docsUrl && (
              <a
                href={software.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="brand-text-secondary inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-[#060B14] px-3 py-2 text-xs font-medium transition hover:border-brand-border"
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
                <Layers className="brand-text h-5 w-5" />
                <h2 className="text-xl font-bold text-[#F8FAFC]">
                  Categorized Release Artifacts — v{latestRelease.version}
                </h2>
                <span className="brand-badge rounded-md px-2 py-0.5 font-mono text-xs font-semibold">
                  LATEST {latestRelease.channel}
                </span>
              </div>
              <p className="mt-1 text-xs text-[#94A3B8]">
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
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-[#0D1424] px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-brand-border hover:text-white"
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
          <section className="brand-surface-card rounded-2xl p-6">
            <h2 className="text-lg font-bold text-[#F8FAFC]">
              Software Overview &amp; Highlights
            </h2>
            <div className="mt-4 whitespace-pre-line text-sm leading-relaxed text-slate-300">
              {software.description}
            </div>
          </section>

          {/* Quick-Start Setup Steps */}
          {software.setupSteps.length > 0 && (
            <section className="brand-surface-card rounded-2xl p-6">
              <div className="flex items-center gap-2">
                <Terminal className="brand-text h-5 w-5" />
                <h2 className="text-lg font-bold text-[#F8FAFC]">
                  Quick-Start &amp; Installation Steps
                </h2>
              </div>
              <ol className="mt-4 space-y-3">
                {software.setupSteps.map((step, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3.5 rounded-xl border border-slate-800/80 bg-[#060B14] p-4"
                  >
                    <span className="brand-badge flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold">
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
          <section className="brand-surface-card rounded-2xl p-6">
            <h2 className="text-base font-bold text-[#F8FAFC]">
              System Requirements
            </h2>
            {software.requirements.length === 0 ? (
              <p className="mt-3 text-xs text-[#94A3B8]">
                Standard {software.platform} runtime environment.
              </p>
            ) : (
              <ul className="mt-4 space-y-2.5">
                {software.requirements.map((req, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-sm text-slate-300"
                  >
                    <CheckCircle2 className="brand-text mt-0.5 h-4 w-4 shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="brand-surface-card rounded-2xl p-6">
            <h2 className="text-base font-bold text-[#F8FAFC]">
              Package Provenance
            </h2>
            <dl className="mt-4 space-y-3 text-xs">
              <div className="flex justify-between border-b border-slate-800/70 pb-2">
                <dt className="text-[#94A3B8]">Author / Maintainer</dt>
                <dd className="font-medium text-white">
                  <a
                    href={OWNER_PORTFOLIO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="brand-link hover:underline"
                  >
                    {OWNER_NAME} ↗
                  </a>
                </dd>
              </div>
              <div className="flex justify-between border-b border-slate-800/70 pb-2">
                <dt className="text-[#94A3B8]">Target Platform</dt>
                <dd className="font-mono text-slate-200">
                  {software.platform}
                </dd>
              </div>
              <div className="flex justify-between border-b border-slate-800/70 pb-2">
                <dt className="text-[#94A3B8]">License</dt>
                <dd className="brand-text font-mono">
                  {software.license}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#94A3B8]">Total Releases</dt>
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
        <h2 className="text-xl font-bold text-[#F8FAFC]">
          Version History &amp; Release Notes
        </h2>
        <p className="mt-1 text-xs text-[#94A3B8]">
          Complete release timeline, changelogs, and historical downloadable
          artifacts for {software.name}.
        </p>

        <div className="mt-6 space-y-6">
          {latestRelease && (
            <div className="brand-card-featured rounded-2xl p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="brand-badge rounded-lg px-2.5 py-1 font-mono text-sm font-bold">
                    v{latestRelease.version}
                  </span>
                  <span className="brand-btn-primary rounded px-2 py-0.5 font-mono text-[10px] font-bold uppercase">
                    Latest
                  </span>
                  <span className="rounded border border-slate-700 bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-slate-300">
                    {latestRelease.channel}
                  </span>
                  {latestRelease.releaseTitle && (
                    <span className="text-sm font-semibold text-[#F8FAFC]">
                      {latestRelease.releaseTitle}
                    </span>
                  )}
                </div>
                <span className="font-mono text-xs text-[#94A3B8]">
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

              <div className="mt-4 whitespace-pre-line rounded-xl border border-slate-800/80 bg-[#060B14] p-4 font-mono text-xs leading-relaxed text-slate-300">
                {latestRelease.changelog}
              </div>
            </div>
          )}

          {/* Expandable Older Versions */}
          {olderReleases.map((rel) => (
            <details
              key={rel.id}
              className="brand-surface-card group rounded-2xl p-5"
            >
              <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 font-mono text-xs font-bold text-slate-200">
                    v{rel.version}
                  </span>
                  <span className="rounded border border-slate-800 bg-[#060B14] px-2 py-0.5 font-mono text-[10px] text-[#94A3B8]">
                    {rel.channel}
                  </span>
                  {rel.releaseTitle && (
                    <span className="text-sm font-semibold text-slate-200">
                      {rel.releaseTitle}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-[#94A3B8]">
                    {new Date(rel.releaseDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="brand-text text-xs font-medium group-open:underline">
                    Toggle Release &amp; Artifacts ({rel.artifacts.length})
                  </span>
                </div>
              </summary>

              <div className="mt-5 space-y-5 border-t border-slate-800/80 pt-4">
                <div className="whitespace-pre-line rounded-xl border border-slate-800/80 bg-[#060B14] p-4 font-mono text-xs leading-relaxed text-slate-300">
                  {rel.changelog}
                </div>
                <ArtifactMatrix artifacts={rel.artifacts} />
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Non-intrusive AdSense slot strictly below Version History (renders null until NEXT_PUBLIC_ADSENSE_CLIENT is set) */}
      <AdSlot slot="software-hub-detail-bottom" className="mt-10" />
    </div>
  );
}
