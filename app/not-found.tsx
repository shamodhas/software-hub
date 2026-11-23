import Link from "next/link";
import { ArrowLeft, Terminal } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
        <Terminal className="h-7 w-7" />
      </div>
      <h1 className="mt-5 text-2xl font-bold text-white">
        404 — Software Release Not Found
      </h1>
      <p className="mt-2 text-sm text-slate-400">
        The requested software package or release artifact does not exist or is
        not currently published.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Return to Shamodha Releases Directory</span>
      </Link>
    </div>
  );
}

