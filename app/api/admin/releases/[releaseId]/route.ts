import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { releaseId: string } }
) {
  try {
    const body = await req.json();
    const existing = await prisma.release.findUnique({
      where: { id: params.releaseId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Release not found." },
        { status: 404 }
      );
    }

    const updated = await prisma.$transaction(async (tx) => {
      if (body.isLatest === true) {
        await tx.release.updateMany({
          where: {
            softwareId: existing.softwareId,
            id: { not: existing.id },
          },
          data: { isLatest: false },
        });
      }

      return tx.release.update({
        where: { id: params.releaseId },
        data: {
          version:
            typeof body.version === "string"
              ? body.version.trim().replace(/^v/i, "")
              : undefined,
          releaseTitle:
            body.releaseTitle !== undefined
              ? body.releaseTitle
                ? String(body.releaseTitle).trim()
                : null
              : undefined,
          channel:
            typeof body.channel === "string" &&
            ["STABLE", "BETA", "ALPHA"].includes(body.channel)
              ? body.channel
              : undefined,
          isLatest:
            typeof body.isLatest === "boolean" ? body.isLatest : undefined,
          changelog:
            typeof body.changelog === "string"
              ? body.changelog.trim()
              : undefined,
          githubTagUrl:
            body.githubTagUrl !== undefined
              ? body.githubTagUrl
                ? String(body.githubTagUrl).trim()
                : null
              : undefined,
        },
        include: {
          artifacts: true,
        },
      });
    });

    return NextResponse.json(updated);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to update release.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { releaseId: string } }
) {
  try {
    const existing = await prisma.release.findUnique({
      where: { id: params.releaseId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Release not found." },
        { status: 404 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.release.delete({
        where: { id: params.releaseId },
      });

      if (existing.isLatest) {
        const nextLatest = await tx.release.findFirst({
          where: { softwareId: existing.softwareId },
          orderBy: { releaseDate: "desc" },
        });

        if (nextLatest) {
          await tx.release.update({
            where: { id: nextLatest.id },
            data: { isLatest: true },
          });
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to delete release.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
