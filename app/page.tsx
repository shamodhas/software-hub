import { prisma } from "@/lib/prisma";
import {
  SoftwareCatalogClient,
  SoftwareItem,
  CategoryItem,
} from "@/components/SoftwareCatalogClient";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams?: { category?: string };
}) {
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

  const categories: CategoryItem[] = categoriesRaw.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    sortOrder: c.sortOrder,
  }));

  const software: SoftwareItem[] = softwareRaw.map((s) => ({
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

  const initialCategory = searchParams?.category || "all";

  return (
    <SoftwareCatalogClient
      software={software}
      categories={categories}
      initialCategory={initialCategory}
    />
  );
}

