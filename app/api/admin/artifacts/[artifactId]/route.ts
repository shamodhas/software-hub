import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { artifactId: string } }
) {
  try {
    await prisma.releaseArtifact.delete({
      where: { id: params.artifactId },
    });
    revalidatePath("/");
    revalidatePath("/software/[slug]", "page");
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to delete artifact.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

