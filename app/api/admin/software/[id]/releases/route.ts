import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const softwareId = params.id;
    const body = await req.json();

    const version = String(body.version || "")
      .trim()
      .replace(/^v/i, "");
    const releaseTitle = body.releaseTitle
      ? String(body.releaseTitle).trim()
      : null;
    const channel = ["STABLE", "BETA", "ALPHA"].includes(body.channel)
      ? body.channel
      : "STABLE";
    const requestedLatest = Boolean(body.isLatest);
    const changelog = String(body.changelog || "").trim();
    const githubTagUrl = body.githubTagUrl
      ? String(body.githubTagUrl).trim()
      : null;

    if (!version || !changelog) {
      return NextResponse.json(
        { error: "Version and changelog are required." },
        { status: 400 }
      );
    }

    const created = await prisma.$transaction(async (tx) => {
      const existingCount = await tx.release.count({
        where: { softwareId },
      });

      const isLatest = existingCount === 0 ? true : requestedLatest;

      if (isLatest) {
        await tx.release.updateMany({
          where: { softwareId },
          data: { isLatest: false },
        });
      }

      return tx.release.create({
        data: {
          softwareId,
          version,
          releaseTitle,
          channel,
          isLatest,
          changelog,
          githubTagUrl,
        },
        include: {
          artifacts: true,
        },
      });
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to create release.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
