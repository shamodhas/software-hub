import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Cpu,
  FileArchive,
  FileCode2,
  Package,
  ShieldCheck,
  Globe,
  Github,
  MapPin,
  Terminal,
} from "lucide-react";
import {
  CANONICAL_SITE_URL,
  OWNER_FULL_NAME,
  OWNER_GITHUB_URL,
  OWNER_LOCATION,
  OWNER_NAME,
  OWNER_PORTFOLIO_URL,
  REPO_GITHUB_URL,
  SITE_NAME,
} from "@/lib/site";
import { BrandLogo } from "@/components/BrandLogo";

export const metadata: Metadata = {
  title: `About ${SITE_NAME} & ${OWNER_NAME}`,
  description: `Learn about ${SITE_NAME} (${CANONICAL_SITE_URL}), the official software release & open-source distribution portal engineered by ${OWNER_NAME} in ${OWNER_LOCATION}.`,
  alternates: {
    canonical: `${CANONICAL_SITE_URL}/about`,
  },
  openGraph: {
    title: `About ${SITE_NAME} & ${OWNER_NAME}`,
    description: `Official software release registry and open-source distribution portal by ${OWNER_NAME}.`,
    url: `${CANONICAL_SITE_URL}/about`,
    siteName: SITE_NAME,
  },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-medium text-[#94A3B8] transition hover:text-brand-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to {SITE_NAME} Catalog</span>
      </Link>

      {/* Hero Card */}
      <div className="brand-card-featured mt-6 rounded-3xl p-6 sm:p-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <BrandLogo size="lg" />
          <div>
            <span className="brand-badge inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Verified Software &amp; Open-Source Release Registry</span>
            </span>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#F8FAFC] sm:text-4xl">
              About {SITE_NAME}
            </h1>
            <p className="mt-2 text-sm text-[#94A3B8]">
              Canonical Distribution Portal:{" "}
              <span className="brand-text font-mono">{CANONICAL_SITE_URL}</span>
            </p>
          </div>
        </div>

        <p className="mt-6 text-base leading-relaxed text-slate-300">
          <strong>{SITE_NAME}</strong> is the official software release
          engineering and open-source distribution portal created by{" "}
          <a
            href={OWNER_PORTFOLIO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="brand-link font-semibold underline underline-offset-4"
          >
            {OWNER_NAME}
          </a>
          . It provides developers, system administrators, and end users with a
          single, verified destination to inspect release changelogs, validate
          SHA-256 checksums, and download production-ready executables, CLI
          toolchains, and backend library starters.
        </p>
      </div>

      {/* Categorized Distribution Philosophy */}
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="brand-surface-card rounded-2xl p-6">
          <div className="flex items-center gap-2.5">
            <Cpu className="brand-text h-5 w-5" />
            <h2 className="text-base font-bold text-[#F8FAFC]">
              Standalone Executables &amp; Binaries
            </h2>
          </div>
          <p className="mt-2.5 text-sm leading-relaxed text-slate-300">
            Desktop utilities such as <strong>Android Mirror</strong> are
            distributed as self-contained binaries with explicit system
            requirements, quick-start onboarding steps, and one-click SHA-256
            hash verification.
          </p>
        </div>

        <div className="brand-surface-card rounded-2xl p-6">
          <div className="flex items-center gap-2.5">
            <Package className="brand-text-secondary h-5 w-5" />
            <h2 className="text-base font-bold text-[#F8FAFC]">
              Package Registries &amp; CLI Scaffolds
            </h2>
          </div>
          <p className="mt-2.5 text-sm leading-relaxed text-slate-300">
            Developer toolchains and backend libraries like{" "}
            <strong>create-node-ss</strong> and{" "}
            <strong>jwt-security-spring-boot-starter</strong> link directly to
            their published artifacts on NPM and Maven Central alongside full
            version documentation.
          </p>
        </div>

        <div className="brand-surface-card rounded-2xl p-6">
          <div className="flex items-center gap-2.5">
            <FileArchive className="brand-text h-5 w-5" />
            <h2 className="text-base font-bold text-[#F8FAFC]">
              Immutable Source Code Archives
            </h2>
          </div>
          <p className="mt-2.5 text-sm leading-relaxed text-slate-300">
            Every tagged release provides direct access to immutable{" "}
            <code>.zip</code> and <code>.tar.gz</code> source code snapshots so
            developers can audit or compile any historical version from source.
          </p>
        </div>

        <div className="brand-surface-card rounded-2xl p-6">
          <div className="flex items-center gap-2.5">
            <FileCode2 className="brand-text-secondary h-5 w-5" />
            <h2 className="text-base font-bold text-[#F8FAFC]">
              Transparent GitHub Provenance
            </h2>
          </div>
          <p className="mt-2.5 text-sm leading-relaxed text-slate-300">
            All public releases are backed by open GitHub repositories and
            semantic version tags under{" "}
            <a
              href={OWNER_GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="brand-link font-mono underline underline-offset-4"
            >
              github.com/shamodhas
            </a>
            .
          </p>
        </div>
      </div>

      {/* About the Creator */}
      <section className="brand-surface-card mt-8 rounded-3xl p-6 sm:p-8">
        <div className="flex items-center gap-2.5">
          <Terminal className="brand-text h-5 w-5" />
          <h2 className="text-xl font-bold text-[#F8FAFC]">
            About the Creator — {OWNER_NAME}
          </h2>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          <strong>{OWNER_NAME}</strong> ({OWNER_FULL_NAME}) is a Software,
          Cloud, DevOps &amp; AI Engineer based in{" "}
          <strong>{OWNER_LOCATION}</strong>. His engineering work spans
          enterprise Java &amp; Spring Boot architectures, Node.js/TypeScript
          microservices, Next.js full-stack platforms, Docker &amp; Kubernetes
          cloud infrastructure, and applied AI/ML automation toolkits.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href={OWNER_PORTFOLIO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="brand-btn-primary inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold"
          >
            <Globe className="h-4 w-4" />
            <span>Official Portfolio (shamodha.com) ↗</span>
          </a>

          <a
            href={OWNER_GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-[#060B14] px-4 py-2.5 text-xs font-semibold text-slate-200 transition hover:border-brand-border hover:text-white"
          >
            <Github className="h-4 w-4" />
            <span>GitHub Profile (@shamodhas) ↗</span>
          </a>

          <a
            href={REPO_GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-[#060B14] px-4 py-2.5 text-xs font-medium text-slate-300 transition hover:border-brand-border hover:text-white"
          >
            <span>Software Hub Repository ↗</span>
          </a>

          <span className="inline-flex items-center gap-1.5 text-xs text-[#94A3B8]">
            <MapPin className="brand-text h-3.5 w-3.5" />
            <span>{OWNER_LOCATION}</span>
          </span>
        </div>
      </section>
    </div>
  );
}
