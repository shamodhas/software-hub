import { prisma } from "@/lib/prisma";
import { AdminNav } from "@/components/AdminNav";
import {
  AdminDashboardClient,
  AdminSoftwareRow,
} from "@/components/AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const softwareList = await prisma.software.findMany({
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
  });

  const rows: AdminSoftwareRow[] = softwareList.map((s) => {
    const latest = s.releases.find((r) => r.isLatest) || s.releases[0];
    const downloads = s.releases.reduce(
      (acc, r) =>
        acc + r.artifacts.reduce((sum, a) => sum + a.downloadCount, 0),
      0
    );

    return {
      id: s.id,
      slug: s.slug,
      name: s.name,
      tagline: s.tagline,
      platform: s.platform,
      license: s.license,
      status: s.status,
      featured: s.featured,
      categoryName: s.category.name,
      latestVersion: latest?.version || null,
      releaseCount: s.releases.length,
      downloadCount: downloads,
      updatedAt: s.updatedAt.toISOString(),
    };
  });

  return (
    <div>
      <AdminNav />
      <AdminDashboardClient initialSoftware={rows} />
    </div>
  );
}

