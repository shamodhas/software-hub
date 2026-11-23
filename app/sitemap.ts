import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { CANONICAL_SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: CANONICAL_SITE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${CANONICAL_SITE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${CANONICAL_SITE_URL}/privacy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${CANONICAL_SITE_URL}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  try {
    const publishedSoftware = await prisma.software.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    });

    if (!publishedSoftware || publishedSoftware.length === 0) {
      return staticRoutes;
    }

    const softwareRoutes: MetadataRoute.Sitemap = publishedSoftware.map(
      (item) => ({
        url: `${CANONICAL_SITE_URL}/software/${item.slug}`,
        lastModified: item.updatedAt,
        changeFrequency: "weekly",
        priority: 0.9,
      })
    );

    return [...staticRoutes, ...softwareRoutes];
  } catch {
    return staticRoutes;
  }
}
