import { prisma } from "@/lib/prisma";
import { AdminNav } from "@/components/AdminNav";
import { SoftwareFormClient } from "@/components/SoftwareFormClient";

export const dynamic = "force-dynamic";

export default async function NewSoftwarePage() {
  const categories = await prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: { id: true, name: true },
  });

  return (
    <div>
      <AdminNav />
      <SoftwareFormClient categories={categories} mode="create" />
    </div>
  );
}

