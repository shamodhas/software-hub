import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
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

    const softwareRoutes: MetadataRoute.Sitemap = publishedSoftware.map(
      (item) => ({
        url: `${SITE_URL}/software/${item.slug}`,
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

