import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { CANONICAL_SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: CANONICAL_SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
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
