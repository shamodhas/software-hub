import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Github,
  Globe,
  MapPin,
  Bug,
  MessageSquare,
} from "lucide-react";
import {
  CANONICAL_SITE_URL,
  OWNER_EMAIL,
  OWNER_GITHUB_URL,
  OWNER_LOCATION,
  OWNER_NAME,
  OWNER_PORTFOLIO_URL,
  REPO_GITHUB_URL,
  SITE_NAME,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact & Developer Support",
  description: `Contact ${OWNER_NAME} for technical support, bug reports, security disclosures, or inquiries regarding ${SITE_NAME} (${CANONICAL_SITE_URL}).`,
  alternates: {
    canonical: `${CANONICAL_SITE_URL}/contact`,
  },
  openGraph: {
    title: `Contact & Support | ${SITE_NAME}`,
    description: `Get in touch with ${OWNER_NAME} regarding ${SITE_NAME} software releases and open-source packages.`,
    url: `${CANONICAL_SITE_URL}/contact`,
    siteName: SITE_NAME,
  },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-medium text-[#94A3B8] transition hover:text-brand-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to {SITE_NAME} Catalog</span>
      </Link>

      <div className="brand-card-featured mt-6 rounded-3xl p-6 sm:p-10">
        <span className="brand-badge inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold">
          <MessageSquare className="h-3.5 w-3.5" />
          <span>Developer Support &amp; Inquiries</span>
        </span>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#F8FAFC] sm:text-4xl">
          Contact &amp; Support
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          Need assistance with a software release, want to report a bug or
          checksum mismatch, or have an engineering collaboration inquiry? Reach
          out directly to <strong>{OWNER_NAME}</strong> through any of the
          verified channels below.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Direct Email */}
        <div className="brand-surface-card flex flex-col justify-between rounded-2xl p-6">
          <div>
            <div className="brand-badge inline-flex h-10 w-10 items-center justify-center rounded-xl">
              <Mail className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-base font-bold text-[#F8FAFC]">
              Direct Email Support
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-[#94A3B8]">
              For general inquiries, release questions, security disclosures, or
              privacy requests:
            </p>
            <p className="brand-text mt-3 font-mono text-sm font-semibold">
              {OWNER_EMAIL}
            </p>
          </div>

          <div className="mt-6">
            <a
              href={`mailto:${OWNER_EMAIL}`}
              className="brand-btn-primary inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold"
            >
              <Mail className="h-4 w-4" />
              <span>Send Email</span>
            </a>
          </div>
        </div>

        {/* GitHub Issues & Source */}
        <div className="brand-surface-card flex flex-col justify-between rounded-2xl p-6">
          <div>
            <div className="brand-badge inline-flex h-10 w-10 items-center justify-center rounded-xl">
              <Github className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-base font-bold text-[#F8FAFC]">
              GitHub Repositories &amp; Issue Tracker
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-[#94A3B8]">
              For technical bug reports, feature requests, or pull requests on
              individual open-source tools:
            </p>
            <p className="brand-text-secondary mt-3 font-mono text-sm font-semibold">
              github.com/shamodhas
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <a
              href={OWNER_GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="brand-btn-primary inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold"
            >
              <Github className="h-4 w-4" />
              <span>GitHub Profile ↗</span>
            </a>
            <a
              href={`${REPO_GITHUB_URL}/issues`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-[#060B14] px-3.5 py-2.5 text-xs font-semibold text-slate-200 transition hover:border-brand-border hover:text-white"
            >
              <Bug className="h-3.5 w-3.5" />
              <span>Open Issue ↗</span>
            </a>
          </div>
        </div>
      </div>

      {/* Portfolio & Location Info */}
      <div className="brand-surface-card mt-6 flex flex-col items-start justify-between gap-4 rounded-2xl p-6 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-sm font-bold text-[#F8FAFC]">
            Official Portfolio &amp; Location
          </h3>
          <p className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[#94A3B8]">
            <span className="inline-flex items-center gap-1">
              <MapPin className="brand-text h-3.5 w-3.5" />
              {OWNER_LOCATION}
            </span>
            <span>•</span>
            <span>Maintained by {OWNER_NAME}</span>
          </p>
        </div>

        <a
          href={OWNER_PORTFOLIO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-[#060B14] px-4 py-2.5 text-xs font-semibold text-slate-200 transition hover:border-brand-border hover:text-white"
        >
          <Globe className="brand-text h-4 w-4" />
          <span>Visit shamodha.com ↗</span>
        </a>
      </div>
    </div>
  );
}
