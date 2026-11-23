import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import path from "path";
import { mkdir, writeFile } from "fs/promises";

const VALID_ARTIFACT_TYPES = [
  "EXECUTABLE",
  "PORTABLE_ZIP",
  "SOURCE_ARCHIVE",
  "GITHUB_SOURCE",
  "PACKAGE_REGISTRY",
];

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export async function POST(
  req: NextRequest,
  { params }: { params: { releaseId: string } }
) {
  try {
    const releaseId = params.releaseId;
    const contentType = req.headers.get("content-type") || "";

    let artifactType = "EXECUTABLE";
    let label = "";
    let fileName: string | null = null;
    let fileSize: string | null = null;
    let sha256: string | null = null;
    let downloadUrl = "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      artifactType = String(formData.get("artifactType") || "EXECUTABLE");
      label = String(formData.get("label") || "").trim();
      const externalUrl = String(formData.get("downloadUrl") || "").trim();
      const manualFileName = String(formData.get("fileName") || "").trim();
      const manualFileSize = String(formData.get("fileSize") || "").trim();
      const manualSha256 = String(formData.get("sha256") || "").trim();

      const fileEntry = formData.get("file");

      if (fileEntry && fileEntry instanceof File && fileEntry.size > 0) {
        const arrayBuffer = await fileEntry.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const safeOriginalName = fileEntry.name.replace(
          /[^a-zA-Z0-9._-]/g,
          "_"
        );
        const targetDir = path.join(
          process.cwd(),
          "public",
          "uploads",
          "releases",
          releaseId
        );
        await mkdir(targetDir, { recursive: true });

        const targetFilePath = path.join(targetDir, safeOriginalName);
        await writeFile(targetFilePath, buffer);

        fileName = manualFileName || safeOriginalName;
        fileSize = manualFileSize || formatBytes(buffer.byteLength);
        sha256 =
          manualSha256 ||
          crypto.createHash("sha256").update(buffer).digest("hex");
        downloadUrl = `/uploads/releases/${releaseId}/${safeOriginalName}`;
      } else {
        downloadUrl = externalUrl;
        fileName = manualFileName || null;
        fileSize = manualFileSize || null;
        sha256 = manualSha256 || null;
      }
    } else {
      const body = await req.json();
      artifactType = String(body.artifactType || "EXECUTABLE");
      label = String(body.label || "").trim();
      downloadUrl = String(body.downloadUrl || "").trim();
      fileName = body.fileName ? String(body.fileName).trim() : null;
      fileSize = body.fileSize ? String(body.fileSize).trim() : null;
      sha256 = body.sha256 ? String(body.sha256).trim() : null;
    }

    if (!VALID_ARTIFACT_TYPES.includes(artifactType)) {
      artifactType = "EXECUTABLE";
    }

    if (!label || !downloadUrl) {
      return NextResponse.json(
        {
          error:
            "Artifact label and either a download URL or uploaded file are required.",
        },
        { status: 400 }
      );
    }

    const created = await prisma.releaseArtifact.create({
      data: {
        releaseId,
        artifactType,
        label,
        fileName,
        fileSize,
        sha256,
        downloadUrl,
      },
    });

    revalidatePath("/");
    revalidatePath("/software/[slug]", "page");

    return NextResponse.json(created, { status: 201 });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to add release artifact.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

