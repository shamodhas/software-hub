"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyShaButton({ sha256 }: { sha256: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(sha256);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={`Copy full SHA-256: ${sha256}`}
      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 font-mono text-[11px] text-slate-300 transition hover:border-emerald-500/40 hover:text-emerald-300"
    >
      {copied ? (
        <>
          <Check className="h-3 w-3 text-emerald-400" />
          <span className="text-emerald-400">Copied SHA-256!</span>
        </>
      ) : (
        <>
          <Copy className="h-3 w-3 text-slate-400" />
          <span>SHA-256: {sha256.slice(0, 12)}…</span>
        </>
      )}
    </button>
  );
}

