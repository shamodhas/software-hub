import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminNav } from "@/components/AdminNav";
import {
  ReleaseManagerClient,
  AdminReleaseItem,
} from "@/components/ReleaseManagerClient";

export const dynamic = "force-dynamic";

export default async function SoftwareReleasesAdminPage({
  params,
}: {
  params: { id: string };
}) {
  const software = await prisma.software.findUnique({
    where: { id: params.id },
    include: {
      releases: {
        orderBy: [{ isLatest: "desc" }, { releaseDate: "desc" }],
        include: {
          artifacts: true,
        },
      },
    },
  });

  if (!software) {
    notFound();
  }

  const initialReleases: AdminReleaseItem[] = software.releases.map((r) => ({
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
  }));

  return (
    <div>
      <AdminNav />
      <ReleaseManagerClient
        software={{
          id: software.id,
          name: software.name,
          slug: software.slug,
          githubRepoUrl: software.githubRepoUrl,
        }}
        initialReleases={initialReleases}
      />
    </div>
  );
}

