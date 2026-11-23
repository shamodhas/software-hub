import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminNav } from "@/components/AdminNav";
import { SoftwareFormClient } from "@/components/SoftwareFormClient";

export const dynamic = "force-dynamic";

export default async function EditSoftwarePage({
  params,
}: {
  params: { id: string };
}) {
  const [categories, software] = await Promise.all([
    prisma.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: { id: true, name: true },
    }),
    prisma.software.findUnique({
      where: { id: params.id },
    }),
  ]);

  if (!software) {
    notFound();
  }

  return (
    <div>
      <AdminNav />
      <SoftwareFormClient
        categories={categories}
        mode="edit"
        initialValues={{
          id: software.id,
          name: software.name,
          slug: software.slug,
          tagline: software.tagline,
          description: software.description,
          categoryId: software.categoryId,
          platform: software.platform,
          license: software.license,
          status: software.status,
          featured: software.featured,
          githubRepoUrl: software.githubRepoUrl || "",
          githubReleasesUrl: software.githubReleasesUrl || "",
          docsUrl: software.docsUrl || "",
          iconName: software.iconName || "Package",
          requirements: software.requirements,
          setupSteps: software.setupSteps,
        }}
      />
    </div>
  );
}

