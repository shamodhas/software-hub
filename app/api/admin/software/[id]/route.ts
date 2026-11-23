import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const software = await prisma.software.findUnique({
    where: { id: params.id },
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

  if (!software) {
    return NextResponse.json({ error: "Software not found." }, { status: 404 });
  }
  return NextResponse.json(software);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const data: Record<string, unknown> = {};

    if (typeof body.name === "string") data.name = body.name.trim();
    if (typeof body.slug === "string") data.slug = body.slug.trim();
    if (typeof body.tagline === "string") data.tagline = body.tagline.trim();
    if (typeof body.description === "string")
      data.description = body.description.trim();
    if (typeof body.categoryId === "string")
      data.categoryId = body.categoryId.trim();
    if (typeof body.platform === "string") data.platform = body.platform.trim();
    if (typeof body.license === "string") data.license = body.license.trim();
    if (typeof body.status === "string") data.status = body.status;
    if (typeof body.featured === "boolean") data.featured = body.featured;
    if (body.githubRepoUrl !== undefined)
      data.githubRepoUrl = body.githubRepoUrl
        ? String(body.githubRepoUrl).trim()
        : null;
    if (body.githubReleasesUrl !== undefined)
      data.githubReleasesUrl = body.githubReleasesUrl
        ? String(body.githubReleasesUrl).trim()
        : null;
    if (body.docsUrl !== undefined)
      data.docsUrl = body.docsUrl ? String(body.docsUrl).trim() : null;
    if (body.iconName !== undefined)
      data.iconName = body.iconName ? String(body.iconName).trim() : "Package";
    if (Array.isArray(body.requirements)) {
      data.requirements = body.requirements
        .map((r: unknown) => String(r).trim())
        .filter(Boolean);
    }
    if (Array.isArray(body.setupSteps)) {
      data.setupSteps = body.setupSteps
        .map((s: unknown) => String(s).trim())
        .filter(Boolean);
    }

    const updated = await prisma.software.update({
      where: { id: params.id },
      data,
    });
    return NextResponse.json(updated);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to update software.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.software.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to delete software.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

