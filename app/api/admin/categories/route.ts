import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: {
      _count: {
        select: { software: true },
      },
    },
  });
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = String(body.name || "").trim();
    const slug = String(body.slug || slugify(name)).trim();
    const description = body.description ? String(body.description).trim() : null;
    const sortOrder = Number.isFinite(Number(body.sortOrder))
      ? Number(body.sortOrder)
      : 0;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Category name and slug are required." },
        { status: 400 }
      );
    }

    const created = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        sortOrder,
      },
    });
    revalidatePath("/");
    return NextResponse.json(created, { status: 201 });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to create category.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

