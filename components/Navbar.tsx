import Link from "next/link";
import {
  Terminal,
  ExternalLink,
  Github,
  Layers,
  Package,
} from "lucide-react";
import {
  OWNER_GITHUB_URL,
  OWNER_PORTFOLIO_URL,
  SITE_NAME,
} from "@/lib/site";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 text-emerald-400 shadow-sm shadow-emerald-500/10 transition group-hover:border-emerald-400/50">
            <Terminal className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-white">
                {SITE_NAME}
              </span>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                Hub
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Software &amp; Open-Source Distribution by Shamodha Sahan
            </p>
          </div>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/#catalog"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-900 hover:text-white"
          >
            <Package className="h-4 w-4 text-emerald-400" />
            <span>All Software</span>
          </Link>
          <Link
            href="/#categories"
            className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-900 hover:text-white sm:flex"
          >
            <Layers className="h-4 w-4 text-cyan-400" />
            <span>Categories</span>
          </Link>
          <a
            href={OWNER_PORTFOLIO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-900 hover:text-emerald-400"
          >
            <span>Portfolio</span>
            <ExternalLink className="h-3.5 w-3.5 opacity-75" />
          </a>
          <a
            href={OWNER_GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/90 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white"
          >
            <Github className="h-4 w-4" />
            <span className="hidden sm:inline">GitHub</span>
            <span className="text-xs text-slate-400">↗</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
