import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { artifactId: string } }
) {
  const { artifactId } = params;

  try {
    const artifact = await prisma.releaseArtifact.update({
      where: { id: artifactId },
      data: {
        downloadCount: {
          increment: 1,
        },
      },
    });

    const targetUrl = artifact.downloadUrl.startsWith("http")
      ? artifact.downloadUrl
      : new URL(artifact.downloadUrl, req.url).toString();

    return NextResponse.redirect(targetUrl, { status: 302 });
  } catch {
    return NextResponse.json(
      { error: "Release artifact not found" },
      { status: 404 }
    );
  }
}

