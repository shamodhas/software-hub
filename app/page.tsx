import { prisma } from "@/lib/prisma";
import {
  SoftwareCatalogClient,
  SoftwareItem,
  CategoryItem,
} from "@/components/SoftwareCatalogClient";
import { AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams?: { category?: string };
}) {
  let categories: CategoryItem[] = [];
  let software: SoftwareItem[] = [];
  let dbError: string | null = null;

  try {
    const [categoriesRaw, softwareRaw] = await Promise.all([
      prisma.category.findMany({
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      }),
      prisma.software.findMany({
        where: { status: "PUBLISHED" },
        orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
        include: {
          category: true,
          releases: {
            orderBy: [{ isLatest: "desc" }, { releaseDate: "desc" }],
            include: {
              artifacts: true,
            },
          },
        },
      }),
    ]);

    categories = categoriesRaw.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      sortOrder: c.sortOrder,
    }));

    software = softwareRaw.map((s) => ({
      id: s.id,
      slug: s.slug,
      name: s.name,
      tagline: s.tagline,
      description: s.description,
      platform: s.platform,
      license: s.license,
      status: s.status,
      featured: s.featured,
      githubRepoUrl: s.githubRepoUrl,
      githubReleasesUrl: s.githubReleasesUrl,
      docsUrl: s.docsUrl,
      iconName: s.iconName,
      category: {
        id: s.category.id,
        name: s.category.name,
        slug: s.category.slug,
        description: s.category.description,
        sortOrder: s.category.sortOrder,
      },
      releases: s.releases.map((r) => ({
        id: r.id,
        version: r.version,
        releaseTitle: r.releaseTitle,
        channel: r.channel,
        isLatest: r.isLatest,
        releaseDate: r.releaseDate.toISOString(),
        changelog: r.changelog,
        githubTagUrl: r.githubTagUrl,
        artifacts: r.artifacts.map((a) => ({
          id: a.id,
          artifactType: a.artifactType,
          label: a.label,
          fileName: a.fileName,
          fileSize: a.fileSize,
          sha256: a.sha256,
          downloadUrl: a.downloadUrl,
          downloadCount: a.downloadCount,
        })),
      })),
    }));
  } catch (err: unknown) {
    dbError =
      err instanceof Error
        ? err.message
        : "PostgreSQL database is unreachable or schema has not been pushed.";
  }

  const initialCategory = searchParams?.category || "all";

  return (
    <div>
      {dbError && (
        <div className="mx-auto mt-6 max-w-5xl px-4">
          <div className="flex items-start gap-3 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-xs text-amber-200">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
            <div>
              <p className="font-bold text-amber-300">
                PostgreSQL Database Not Initialized or Offline
              </p>
              <p className="mt-1 text-amber-200/80">
                Run <code className="rounded bg-slate-950 px-1.5 py-0.5 font-mono text-emerald-400">npm run setup</code>{" "}
                (or <code className="rounded bg-slate-950 px-1.5 py-0.5 font-mono text-emerald-400">npx prisma db push &amp;&amp; npm run db:seed</code>) to initialize and seed the database.
              </p>
            </div>
          </div>
        </div>
      )}

      <SoftwareCatalogClient
        software={software}
        categories={categories}
        initialCategory={initialCategory}
      />
    </div>
  );
}
