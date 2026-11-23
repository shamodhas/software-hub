import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET() {
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
  return NextResponse.json(softwareList);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = String(body.name || "").trim();
    const slug = String(body.slug || slugify(name)).trim();
    const tagline = String(body.tagline || "").trim();
    const description = String(body.description || "").trim();
    const categoryId = String(body.categoryId || "").trim();
    const platform = String(body.platform || "Cross-Platform").trim();
    const license = String(body.license || "MIT").trim();
    const status = ["PUBLISHED", "DRAFT", "ARCHIVED"].includes(body.status)
      ? body.status
      : "PUBLISHED";
    const featured = Boolean(body.featured);

    if (!name || !slug || !tagline || !description || !categoryId) {
      return NextResponse.json(
        {
          error:
            "Name, slug, tagline, description, and categoryId are required.",
        },
        { status: 400 }
      );
    }

    const requirements = Array.isArray(body.requirements)
      ? body.requirements.map((r: unknown) => String(r).trim()).filter(Boolean)
      : [];
    const setupSteps = Array.isArray(body.setupSteps)
      ? body.setupSteps.map((s: unknown) => String(s).trim()).filter(Boolean)
      : [];

    const created = await prisma.software.create({
      data: {
        name,
        slug,
        tagline,
        description,
        categoryId,
        platform,
        license,
        status,
        featured,
        githubRepoUrl: body.githubRepoUrl ? String(body.githubRepoUrl).trim() : null,
        githubReleasesUrl: body.githubReleasesUrl
          ? String(body.githubReleasesUrl).trim()
          : null,
        docsUrl: body.docsUrl ? String(body.docsUrl).trim() : null,
        iconName: body.iconName ? String(body.iconName).trim() : "Package",
        requirements,
        setupSteps,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to create software.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

