"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Tag,
  CheckCircle2,
  Upload,
  Link2,
  ExternalLink,
  Edit3,
  Save,
} from "lucide-react";

export interface AdminArtifactItem {
  id: string;
  artifactType: string;
  label: string;
  fileName: string | null;
  fileSize: string | null;
  sha256: string | null;
  downloadUrl: string;
  downloadCount: number;
}

export interface AdminReleaseItem {
  id: string;
  version: string;
  releaseTitle: string | null;
  channel: string;
  isLatest: boolean;
  releaseDate: string;
  changelog: string;
  githubTagUrl: string | null;
  artifacts: AdminArtifactItem[];
}

const ARTIFACT_TYPE_OPTIONS = [
  {
    value: "EXECUTABLE",
    label: "EXECUTABLE — Standalone Binary (.exe, .msi, .apk, .dmg, .deb)",
  },
  {
    value: "PORTABLE_ZIP",
    label: "PORTABLE_ZIP — Pre-built Portable Binary ZIP Archive",
  },
  {
    value: "SOURCE_ARCHIVE",
    label: "SOURCE_ARCHIVE — Source Code Snapshot (.zip / .tar.gz)",
  },
  {
    value: "GITHUB_SOURCE",
    label: "GITHUB_SOURCE — Direct GitHub Repository / Release Tag Link",
  },
  {
    value: "PACKAGE_REGISTRY",
    label: "PACKAGE_REGISTRY — NPM / Maven Central / PyPI Package URL",
  },
];

export function ReleaseManagerClient({
  software,
  initialReleases,
}: {
  software: {
    id: string;
    name: string;
    slug: string;
    githubRepoUrl: string | null;
  };
  initialReleases: AdminReleaseItem[];
}) {
  const router = useRouter();
  const [releases, setReleases] = useState<AdminReleaseItem[]>(initialReleases);
  const [error, setError] = useState<string | null>(null);

  // Create New Release State
  const [version, setVersion] = useState("");
  const [releaseTitle, setReleaseTitle] = useState("");
  const [channel, setChannel] = useState("STABLE");
  const [isLatest, setIsLatest] = useState(true);
  const [githubTagUrl, setGithubTagUrl] = useState("");
  const [changelog, setChangelog] = useState("");
  const [creatingRelease, setCreatingRelease] = useState(false);

  // Edit Release State
  const [editingReleaseId, setEditingReleaseId] = useState<string | null>(null);
  const [editVersion, setEditVersion] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editChannel, setEditChannel] = useState("STABLE");
  const [editGithubTagUrl, setEditGithubTagUrl] = useState("");
  const [editChangelog, setEditChangelog] = useState("");

  // Add Artifact State (per active release form)
  const [activeArtifactReleaseId, setActiveArtifactReleaseId] = useState<
    string | null
  >(initialReleases[0]?.id || null);
  const [uploadMode, setUploadMode] = useState<"url" | "file">("url");
  const [artifactType, setArtifactType] = useState("EXECUTABLE");
  const [artifactLabel, setArtifactLabel] = useState(
    "Windows x64 Standalone Executable (.exe)"
  );
  const [artifactUrl, setArtifactUrl] = useState("");
  const [artifactFileName, setArtifactFileName] = useState("");
  const [artifactFileSize, setArtifactFileSize] = useState("");
  const [artifactSha256, setArtifactSha256] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [addingArtifact, setAddingArtifact] = useState(false);

  async function handleCreateRelease(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setCreatingRelease(true);

    try {
      const res = await fetch(`/api/admin/software/${software.id}/releases`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          version,
          releaseTitle,
          channel,
          isLatest,
          githubTagUrl,
          changelog,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create release.");
        setCreatingRelease(false);
        return;
      }

      const newRel: AdminReleaseItem = {
        ...data,
        releaseDate: data.releaseDate || new Date().toISOString(),
        artifacts: data.artifacts || [],
      };

      setReleases((prev) => {
        const updated = isLatest
          ? prev.map((r) => ({ ...r, isLatest: false }))
          : prev;
        return [newRel, ...updated];
      });

      setActiveArtifactReleaseId(newRel.id);
      setVersion("");
      setReleaseTitle("");
      setGithubTagUrl("");
      setChangelog("");
      setCreatingRelease(false);
      router.refresh();
    } catch {
      setError("Network error while creating release.");
      setCreatingRelease(false);
    }
  }

  async function handleSetLatest(releaseId: string) {
    setError(null);
    const res = await fetch(`/api/admin/releases/${releaseId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isLatest: true }),
    });
    if (res.ok) {
      setReleases((prev) =>
        prev.map((r) => ({ ...r, isLatest: r.id === releaseId }))
      );
      router.refresh();
    }
  }

  function startEditingRelease(rel: AdminReleaseItem) {
    setEditingReleaseId(rel.id);
    setEditVersion(rel.version);
    setEditTitle(rel.releaseTitle || "");
    setEditChannel(rel.channel);
    setEditGithubTagUrl(rel.githubTagUrl || "");
    setEditChangelog(rel.changelog);
  }

  async function handleSaveReleaseEdit(releaseId: string) {
    setError(null);
    const res = await fetch(`/api/admin/releases/${releaseId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        version: editVersion,
        releaseTitle: editTitle,
        channel: editChannel,
        githubTagUrl: editGithubTagUrl,
        changelog: editChangelog,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to update release.");
      return;
    }

    setReleases((prev) =>
      prev.map((r) =>
        r.id === releaseId
          ? {
              ...r,
              version: data.version,
              releaseTitle: data.releaseTitle,
              channel: data.channel,
              githubTagUrl: data.githubTagUrl,
              changelog: data.changelog,
            }
          : r
      )
    );
    setEditingReleaseId(null);
    router.refresh();
  }

  async function handleDeleteRelease(rel: AdminReleaseItem) {
    if (
      !window.confirm(
        `Delete version v${rel.version} and all its artifacts?`
      )
    ) {
      return;
    }

    const res = await fetch(`/api/admin/releases/${rel.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setReleases((prev) => prev.filter((r) => r.id !== rel.id));
      router.refresh();
    }
  }

  async function handleAddArtifact(e: React.FormEvent, releaseId: string) {
    e.preventDefault();
    setError(null);
    setAddingArtifact(true);

    try {
      let res: Response;

      if (uploadMode === "file" && selectedFile) {
        const formData = new FormData();
        formData.append("artifactType", artifactType);
        formData.append("label", artifactLabel);
        formData.append("file", selectedFile);
        if (artifactFileName) formData.append("fileName", artifactFileName);
        if (artifactFileSize) formData.append("fileSize", artifactFileSize);
        if (artifactSha256) formData.append("sha256", artifactSha256);

        res = await fetch(`/api/admin/releases/${releaseId}/artifacts`, {
          method: "POST",
          body: formData,
        });
      } else {
        res = await fetch(`/api/admin/releases/${releaseId}/artifacts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            artifactType,
            label: artifactLabel,
            downloadUrl: artifactUrl,
            fileName: artifactFileName || null,
            fileSize: artifactFileSize || null,
            sha256: artifactSha256 || null,
          }),
        });
      }

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to add artifact.");
        setAddingArtifact(false);
        return;
      }

      setReleases((prev) =>
        prev.map((r) =>
          r.id === releaseId
            ? { ...r, artifacts: [...r.artifacts, data] }
            : r
        )
      );

      setArtifactUrl("");
      setArtifactFileName("");
      setArtifactFileSize("");
      setArtifactSha256("");
      setSelectedFile(null);
      setAddingArtifact(false);
      router.refresh();
    } catch {
      setError("Network error while adding artifact.");
      setAddingArtifact(false);
    }
  }

  async function handleDeleteArtifact(releaseId: string, artifactId: string) {
    const res = await fetch(`/api/admin/artifacts/${artifactId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setReleases((prev) =>
        prev.map((r) =>
          r.id === releaseId
            ? {
                ...r,
                artifacts: r.artifacts.filter((a) => a.id !== artifactId),
              }
            : r
        )
      );
      router.refresh();
    }
  }

  function applyArtifactPreset(type: string) {
    setArtifactType(type);
    if (type === "EXECUTABLE") {
      setArtifactLabel("Windows x64 Standalone Executable (.exe)");
    } else if (type === "PORTABLE_ZIP") {
      setArtifactLabel("Portable Binary Archive (.zip)");
    } else if (type === "SOURCE_ARCHIVE") {
      setArtifactLabel("Source Code Archive (ZIP)");
    } else if (type === "GITHUB_SOURCE") {
      setArtifactLabel("GitHub Source Repository");
      if (software.githubRepoUrl && !artifactUrl) {
        setArtifactUrl(software.githubRepoUrl);
      }
    } else if (type === "PACKAGE_REGISTRY") {
      setArtifactLabel("Package Registry Distribution");
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-brand-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Admin Dashboard</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href={`/admin/software/${software.id}/edit`}
            className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800"
          >
            Edit Software Metadata
          </Link>
          <Link
            href={`/software/${software.slug}`}
            target="_blank"
            className="brand-badge inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-semibold hover:opacity-90"
          >
            <span>View Public Release Page</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>

      <div className="mt-4">
        <h1 className="text-2xl font-bold text-white">
          Release &amp; Categorized Artifact Manager — {software.name}
        </h1>
        <p className="text-xs text-slate-400">
          Publish tagged versions and attach categorized binaries (.exe),
          source archives (.zip), GitHub source links, or direct binary uploads
          with automated SHA-256 verification.
        </p>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs font-medium text-rose-300">
          {error}
        </div>
      )}

      {/* Create New Release Form */}
      <form
        onSubmit={handleCreateRelease}
        className="mt-6 rounded-2xl border border-slate-800/90 bg-slate-900/60 p-6"
      >
        <div className="flex items-center gap-2">
          <Tag className="brand-text h-4 w-4" />
          <h2 className="text-sm font-bold text-white">
            Publish New Version Release
          </h2>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div>
            <label className="block text-xs font-medium text-slate-300">
              Version Number *
            </label>
            <input
              type="text"
              required
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="e.g., 1.1.0"
              className="brand-input mt-1 w-full rounded-xl px-3 py-2 font-mono text-xs"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-300">
              Release Title
            </label>
            <input
              type="text"
              value={releaseTitle}
              onChange={(e) => setReleaseTitle(e.target.value)}
              placeholder="e.g., v1.1.0 — Performance & Auto-Updater Improvements"
              className="brand-input mt-1 w-full rounded-xl px-3 py-2 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300">
              Channel
            </label>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              className="brand-input mt-1 w-full rounded-xl px-3 py-2 text-xs"
            >
              <option value="STABLE">STABLE</option>
              <option value="BETA">BETA</option>
              <option value="ALPHA">ALPHA</option>
            </select>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-slate-300">
              GitHub Release Tag URL (Optional)
            </label>
            <input
              type="url"
              value={githubTagUrl}
              onChange={(e) => setGithubTagUrl(e.target.value)}
              placeholder="https://github.com/shamodhas/.../releases/tag/v1.1.0"
              className="brand-input mt-1 w-full rounded-xl px-3 py-2 text-xs"
            />
          </div>

          <div className="flex items-center pt-5">
            <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-slate-200">
              <input
                type="checkbox"
                checked={isLatest}
                onChange={(e) => setIsLatest(e.target.checked)}
                className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-sky-400"
              />
              <span>
                Mark as <strong>Latest Release</strong> (automatically unsets{" "}
                <code>isLatest</code> on older versions)
              </span>
            </label>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-xs font-medium text-slate-300">
            Changelog / Release Notes (Markdown) *
          </label>
          <textarea
            rows={4}
            required
            value={changelog}
            onChange={(e) => setChangelog(e.target.value)}
            placeholder="- Added standalone Windows x64 executable...\n- Fixed wireless ADB reconnection..."
            className="brand-input mt-1 w-full rounded-xl p-3 font-mono text-xs"
          />
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            disabled={creatingRelease}
            className="brand-btn-primary inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-bold disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            <span>
              {creatingRelease ? "Creating Release..." : "Create Release"}
            </span>
          </button>
        </div>
      </form>

      {/* Existing Releases & Categorized Artifacts */}
      <div className="mt-8 space-y-6">
        {releases.map((rel) => (
          <div
            key={rel.id}
            className={`rounded-2xl p-6 ${
              rel.isLatest
                ? "brand-card-featured"
                : "brand-surface-card"
            }`}
          >
            {/* Release Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="brand-badge rounded-lg px-2.5 py-1 font-mono text-sm font-bold">
                  v{rel.version}
                </span>
                <span className="rounded border border-slate-700 bg-slate-800 px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-300">
                  {rel.channel}
                </span>
                {rel.isLatest ? (
                  <span className="brand-btn-primary inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-[10px] font-bold uppercase">
                    <CheckCircle2 className="h-3 w-3" />
                    Latest Active Release
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSetLatest(rel.id)}
                    className="rounded-md border border-slate-700 bg-slate-900 px-2 py-0.5 text-[11px] font-medium text-slate-300 hover:border-brand-border hover:text-brand-primary"
                  >
                    Set as Latest
                  </button>
                )}
                {rel.releaseTitle && (
                  <span className="text-sm font-semibold text-white">
                    {rel.releaseTitle}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    editingReleaseId === rel.id
                      ? setEditingReleaseId(null)
                      : startEditingRelease(rel)
                  }
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs text-slate-200 hover:bg-slate-800"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Edit Notes</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteRelease(rel)}
                  className="inline-flex items-center rounded-lg border border-rose-500/30 bg-rose-500/10 p-1.5 text-rose-300 hover:bg-rose-500/20"
                  title="Delete Release"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Inline Edit Release Notes Form */}
            {editingReleaseId === rel.id ? (
              <div className="mt-4 space-y-3 rounded-xl border border-slate-800 bg-slate-950 p-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <input
                    type="text"
                    value={editVersion}
                    onChange={(e) => setEditVersion(e.target.value)}
                    placeholder="Version"
                    className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 font-mono text-xs text-white"
                  />
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Release Title"
                    className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white"
                  />
                  <select
                    value={editChannel}
                    onChange={(e) => setEditChannel(e.target.value)}
                    className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white"
                  >
                    <option value="STABLE">STABLE</option>
                    <option value="BETA">BETA</option>
                    <option value="ALPHA">ALPHA</option>
                  </select>
                </div>
                <textarea
                  rows={3}
                  value={editChangelog}
                  onChange={(e) => setEditChangelog(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 p-2.5 font-mono text-xs text-white"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingReleaseId(null)}
                    className="rounded-lg border border-slate-800 px-3 py-1 text-xs text-slate-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveReleaseEdit(rel.id)}
                    className="brand-btn-primary inline-flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-bold"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>Save Release</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-3 whitespace-pre-line rounded-xl border border-slate-800/80 bg-slate-950/60 p-3.5 font-mono text-xs text-slate-300">
                {rel.changelog}
              </div>
            )}

            {/* Artifact Table for this Release */}
            <div className="mt-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Categorized Downloadable Artifacts ({rel.artifacts.length})
                </h3>
                <button
                  type="button"
                  onClick={() =>
                    setActiveArtifactReleaseId(
                      activeArtifactReleaseId === rel.id ? null : rel.id
                    )
                  }
                  className="brand-badge inline-flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-semibold hover:opacity-90"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Artifact to v{rel.version}</span>
                </button>
              </div>

              <div className="mt-3 space-y-2">
                {rel.artifacts.map((art) => (
                  <div
                    key={art.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="brand-badge rounded px-2 py-0.5 font-mono text-[10px] font-bold">
                          {art.artifactType}
                        </span>
                        <span className="font-semibold text-white">
                          {art.label}
                        </span>
                        {art.fileName && (
                          <span className="font-mono text-slate-400">
                            ({art.fileName})
                          </span>
                        )}
                        {art.fileSize && (
                          <span className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-[11px] text-cyan-300">
                            {art.fileSize}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] text-slate-400">
                        <span className="max-w-md truncate">
                          URL: {art.downloadUrl}
                        </span>
                        {art.sha256 && (
                          <span>SHA256: {art.sha256.slice(0, 16)}…</span>
                        )}
                        <span className="brand-text">
                          {art.downloadCount} downloads
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteArtifact(rel.id, art.id)}
                      className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-1.5 text-rose-300 hover:bg-rose-500/20"
                      title="Remove Artifact"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Categorized Artifact Form (Supports both External URL and Multipart File Upload) */}
              {activeArtifactReleaseId === rel.id && (
                <form
                  onSubmit={(e) => handleAddArtifact(e, rel.id)}
                  className="brand-card-featured mt-4 rounded-2xl p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="brand-text text-xs font-bold uppercase tracking-wider">
                      Attach Categorized Artifact to v{rel.version}
                    </h4>

                    <div className="inline-flex rounded-xl border border-slate-800 bg-slate-900 p-1 text-xs">
                      <button
                        type="button"
                        onClick={() => setUploadMode("url")}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 font-semibold transition ${
                          uploadMode === "url"
                            ? "brand-btn-primary"
                            : "text-slate-300 hover:text-white"
                        }`}
                      >
                        <Link2 className="h-3.5 w-3.5" />
                        <span>External URL (GitHub Releases / Registry)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setUploadMode("file")}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 font-semibold transition ${
                          uploadMode === "file"
                            ? "brand-btn-primary"
                            : "text-slate-300 hover:text-white"
                        }`}
                      >
                        <Upload className="h-3.5 w-3.5" />
                        <span>Direct File Upload (Auto SHA-256)</span>
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-slate-300">
                        Artifact Category *
                      </label>
                      <select
                        value={artifactType}
                        onChange={(e) => applyArtifactPreset(e.target.value)}
                        className="brand-input mt-1 w-full rounded-xl px-3 py-2 text-xs"
                      >
                        {ARTIFACT_TYPE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300">
                        Display Label *
                      </label>
                      <input
                        type="text"
                        required
                        value={artifactLabel}
                        onChange={(e) => setArtifactLabel(e.target.value)}
                        placeholder="Windows x64 Standalone Executable (.exe)"
                        className="brand-input mt-1 w-full rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                  </div>

                  {uploadMode === "url" ? (
                    <div className="mt-4">
                      <label className="block text-xs font-medium text-slate-300">
                        External Download / GitHub / Registry URL *
                      </label>
                      <input
                        type="url"
                        required
                        value={artifactUrl}
                        onChange={(e) => setArtifactUrl(e.target.value)}
                        placeholder="https://github.com/shamodhas/android-mirror/releases/download/v1.0.0/AndroidMirror.exe"
                        className="brand-input mt-1 w-full rounded-xl px-3 py-2 font-mono text-xs"
                      />
                    </div>
                  ) : (
                    <div className="mt-4">
                      <label className="block text-xs font-medium text-slate-300">
                        Upload Release File (.exe, .zip, .tar.gz, .jar) *
                      </label>
                      <input
                        type="file"
                        required
                        onChange={(e) =>
                          setSelectedFile(e.target.files?.[0] || null)
                        }
                        className="brand-input mt-1 w-full rounded-xl px-3 py-2 text-xs text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-sky-400 file:px-3 file:py-1 file:text-xs file:font-bold file:text-slate-950"
                      />
                      <p className="mt-1 text-[11px] text-slate-400">
                        Saved to{" "}
                        <code>public/uploads/releases/{rel.id}/...</code> with
                        automatic file size and SHA-256 hash computation.
                      </p>
                    </div>
                  )}

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-400">
                        File Name (Optional / Auto-detected)
                      </label>
                      <input
                        type="text"
                        value={artifactFileName}
                        onChange={(e) => setArtifactFileName(e.target.value)}
                        placeholder="AndroidMirror.exe"
                        className="brand-input mt-1 w-full rounded-xl px-3 py-1.5 font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400">
                        File Size (Optional / Auto-computed)
                      </label>
                      <input
                        type="text"
                        value={artifactFileSize}
                        onChange={(e) => setArtifactFileSize(e.target.value)}
                        placeholder="14.2 MB"
                        className="brand-input mt-1 w-full rounded-xl px-3 py-1.5 font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400">
                        SHA-256 Checksum (Optional / Auto-computed)
                      </label>
                      <input
                        type="text"
                        value={artifactSha256}
                        onChange={(e) => setArtifactSha256(e.target.value)}
                        placeholder="e3b0c44298fc1c149afb..."
                        className="brand-input mt-1 w-full rounded-xl px-3 py-1.5 font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveArtifactReleaseId(null)}
                      className="rounded-xl border border-slate-800 px-3.5 py-2 text-xs text-slate-400"
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      disabled={addingArtifact}
                      className="brand-btn-primary inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold disabled:opacity-50"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>
                        {addingArtifact
                          ? "Attaching Artifact..."
                          : "Attach Categorized Artifact"}
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

