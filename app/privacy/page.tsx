import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Lock, Cookie, Eye, Mail, ArrowLeft } from "lucide-react";
import {
  CANONICAL_SITE_URL,
  OWNER_EMAIL,
  OWNER_NAME,
  OWNER_PORTFOLIO_URL,
  SITE_NAME,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy Policy for ${SITE_NAME} (${CANONICAL_SITE_URL}) covering server logs, cookies, download telemetry, and Google AdSense third-party advertising disclosures.`,
  alternates: {
    canonical: `${CANONICAL_SITE_URL}/privacy`,
  },
  openGraph: {
    title: `Privacy Policy | ${SITE_NAME}`,
    description: `Privacy Policy for ${SITE_NAME} (${CANONICAL_SITE_URL}) by ${OWNER_NAME}.`,
    url: `${CANONICAL_SITE_URL}/privacy`,
    siteName: SITE_NAME,
  },
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "November 24, 2026";

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
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="brand-badge inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Legal &amp; Trust Compliance</span>
          </span>
          <span className="font-mono text-xs text-[#94A3B8]">
            Last Updated: {lastUpdated}
          </span>
        </div>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#F8FAFC] sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          This Privacy Policy explains how <strong>{SITE_NAME}</strong> (
          <a
            href={CANONICAL_SITE_URL}
            className="brand-link underline underline-offset-4"
          >
            {CANONICAL_SITE_URL}
          </a>
          ), operated by{" "}
          <a
            href={OWNER_PORTFOLIO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="brand-link font-medium underline underline-offset-4"
          >
            {OWNER_NAME}
          </a>
          , collects, uses, and safeguards information when you browse our
          software release catalog or download open-source distribution
          artifacts.
        </p>
      </div>

      <div className="mt-8 space-y-6">
        {/* 1. Server Logs & Download Telemetry */}
        <section className="brand-surface-card rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-2.5">
            <Eye className="brand-text h-5 w-5" />
            <h2 className="text-lg font-bold text-[#F8FAFC]">
              1. Server Logs &amp; Anonymous Download Telemetry
            </h2>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            Like most standard web servers, our hosting infrastructure
            automatically records basic non-identifying request metadata in
            standard server log files. This information includes browser user
            agents, referring pages, timestamps, and requested route paths.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            When you click a software download link on {SITE_NAME}, our database
            increments an aggregate integer counter (<code>downloadCount</code>)
            for that specific release artifact before redirecting you to the
            binary or canonical GitHub release asset. We do not require user
            registration to download public software, nor do we tie download
            counters to individual personal identities.
          </p>
        </section>

        {/* 2. Cookies & Web Beacons */}
        <section className="brand-surface-card rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-2.5">
            <Cookie className="brand-text-secondary h-5 w-5" />
            <h2 className="text-lg font-bold text-[#F8FAFC]">
              2. Cookies &amp; Local Preferences
            </h2>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            {SITE_NAME} uses strictly necessary HTTP-only session cookies solely
            for authenticated repository administrators managing releases. For
            public visitors, we may use lightweight client-side preferences and
            analytics or advertising cookies to improve site performance and
            measure aggregate traffic trends.
          </p>
        </section>

        {/* 3. Google AdSense & Third-Party Advertising */}
        <section className="brand-surface-card rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-2.5">
            <Lock className="brand-text h-5 w-5" />
            <h2 className="text-lg font-bold text-[#F8FAFC]">
              3. Third-Party Advertising &amp; Google AdSense Disclosure
            </h2>
          </div>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-300">
            <p>
              We may use third-party advertising companies, including{" "}
              <strong>Google AdSense</strong>, to serve non-intrusive
              advertisements when you visit {SITE_NAME} (
              <code>{CANONICAL_SITE_URL}</code>) in order to support open-source
              development and hosting infrastructure.
            </p>
            <ul className="list-disc space-y-2 pl-5 text-slate-300">
              <li>
                Third-party vendors, including Google, use cookies to serve ads
                based on a user&apos;s prior visits to this website or other
                websites on the internet.
              </li>
              <li>
                Google&apos;s use of advertising cookies enables it and its
                partners to serve relevant ads to users based on their visit to{" "}
                {SITE_NAME} and/or other sites on the Internet.
              </li>
              <li>
                Users may opt out of personalized advertising at any time by
                visiting{" "}
                <a
                  href="https://www.google.com/settings/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="brand-link underline underline-offset-4"
                >
                  Google Ads Settings
                </a>
                . Alternatively, you can opt out of a third-party vendor&apos;s
                use of cookies for personalized advertising by visiting{" "}
                <a
                  href="https://www.aboutads.info/choices/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="brand-link underline underline-offset-4"
                >
                  www.aboutads.info
                </a>
                .
              </li>
            </ul>
          </div>
        </section>

        {/* 4. External Links & GitHub Releases */}
        <section className="brand-surface-card rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-[#F8FAFC]">
            4. External Repositories &amp; Package Registries
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            Our catalog links directly to official source code repositories and
            package registries including GitHub (
            <code>github.com/shamodhas</code>), NPM, and Maven Central. Once you
            navigate to an external platform, that platform&apos;s respective
            privacy policy and terms of service govern your session.
          </p>
        </section>

        {/* 5. Contact Information */}
        <section className="brand-surface-card rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-2.5">
            <Mail className="brand-text h-5 w-5" />
            <h2 className="text-lg font-bold text-[#F8FAFC]">
              5. Contact Regarding Privacy
            </h2>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            If you have any questions about this Privacy Policy or our data
            practices, please contact{" "}
            <strong className="text-white">{OWNER_NAME}</strong> at{" "}
            <a
              href={`mailto:${OWNER_EMAIL}`}
              className="brand-link font-mono underline underline-offset-4"
            >
              {OWNER_EMAIL}
            </a>{" "}
            or visit our{" "}
            <Link
              href="/contact"
              className="brand-link underline underline-offset-4"
            >
              Contact &amp; Support page
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
