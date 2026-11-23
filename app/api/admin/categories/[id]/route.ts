import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const data: Record<string, unknown> = {};

    if (typeof body.name === "string") data.name = body.name.trim();
    if (typeof body.slug === "string") data.slug = body.slug.trim();
    if (body.description !== undefined)
      data.description = body.description ? String(body.description).trim() : null;
    if (body.sortOrder !== undefined)
      data.sortOrder = Number(body.sortOrder) || 0;

    const updated = await prisma.category.update({
      where: { id: params.id },
      data,
    });
    revalidatePath("/");
    return NextResponse.json(updated);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to update category.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const count = await prisma.software.count({
      where: { categoryId: params.id },
    });
    if (count > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete category with ${count} linked software package(s). Reassign or delete them first.`,
        },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id: params.id },
    });
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to delete category.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

