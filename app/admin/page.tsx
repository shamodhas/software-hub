import { prisma } from "@/lib/prisma";
import { AdminNav } from "@/components/AdminNav";
import {
  AdminDashboardClient,
  AdminSoftwareRow,
} from "@/components/AdminDashboardClient";
import { AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  let rows: AdminSoftwareRow[] = [];
  let dbError: string | null = null;

  try {
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

    rows = softwareList.map((s) => {
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
  } catch (err: unknown) {
    dbError =
      err instanceof Error
        ? err.message
        : "PostgreSQL database is unreachable or schema has not been pushed.";
  }

  return (
    <div>
      <AdminNav />
      {dbError && (
        <div className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-3 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-xs text-amber-200">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
            <div>
              <p className="font-bold text-amber-300">
                Database Connection / Schema Warning
              </p>
              <p className="mt-1 text-amber-200/80">
                Could not query PostgreSQL. Ensure Docker PostgreSQL (or Neon) is running and run{" "}
                <code className="rounded bg-slate-950 px-1.5 py-0.5 font-mono text-emerald-400">
                  npm run setup
                </code>{" "}
                for dev or{" "}
                <code className="rounded bg-slate-950 px-1.5 py-0.5 font-mono text-emerald-400">
                  npm run setup:prod
                </code>{" "}
                for production.
              </p>
            </div>
          </div>
        </div>
      )}
      <AdminDashboardClient initialSoftware={rows} />
    </div>
  );
}
