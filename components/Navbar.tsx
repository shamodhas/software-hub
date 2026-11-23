import Link from "next/link";
import {
  ExternalLink,
  Github,
  Layers,
  Package,
} from "lucide-react";
import {
  OWNER_GITHUB_URL,
  OWNER_PORTFOLIO_URL,
} from "@/lib/site";
import { BrandLogo } from "@/components/BrandLogo";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#060B14]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center">
          <BrandLogo
            size="md"
            showLabel
            syncDocumentTheme
            subtitle="Software & Open-Source Distribution by Shamodha Sahan"
          />
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/#catalog"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-[#0D1424] hover:text-white"
          >
            <Package className="brand-text h-4 w-4" />
            <span>All Software</span>
          </Link>
          <Link
            href="/#categories"
            className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-[#0D1424] hover:text-white sm:flex"
          >
            <Layers className="brand-text-secondary h-4 w-4" />
            <span>Categories</span>
          </Link>
          <a
            href={OWNER_PORTFOLIO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-[#0D1424] hover:text-brand-primary"
          >
            <span>Portfolio</span>
            <ExternalLink className="h-3.5 w-3.5 opacity-75" />
          </a>
          <a
            href={OWNER_GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-[#0D1424] px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-brand-border hover:text-white"
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
