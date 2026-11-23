import Link from "next/link";
import { Github, Globe } from "lucide-react";
import {
  OWNER_GITHUB_URL,
  OWNER_NAME,
  OWNER_PORTFOLIO_URL,
  SITE_NAME,
} from "@/lib/site";
import { SecretAdminTrigger } from "@/components/SecretAdminAccess";
import { BrandLogo } from "@/components/BrandLogo";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800/80 bg-[#060B14] text-[#94A3B8]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
          <div className="md:col-span-2">
            <BrandLogo size="sm" showLabel />
            <p className="mt-3 max-w-md text-sm leading-relaxed text-[#94A3B8]">
              Official software release distribution portal, standalone desktop
              binaries, CLI scaffolds, and open-source packages engineered by{" "}
              <a
                href={OWNER_PORTFOLIO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="brand-link font-medium hover:underline"
              >
                {OWNER_NAME}
              </a>
              . Every release is checksum-verified and linked to its canonical
              source tree.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#F8FAFC]">
              Quick Categories
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link
                  href="/?category=desktop-utilities#catalog"
                  className="transition hover:text-brand-primary"
                >
                  Desktop Utilities
                </Link>
              </li>
              <li>
                <Link
                  href="/?category=cli-devops#catalog"
                  className="transition hover:text-brand-primary"
                >
                  CLI &amp; DevOps
                </Link>
              </li>
              <li>
                <Link
                  href="/?category=libraries-starters#catalog"
                  className="transition hover:text-brand-primary"
                >
                  Libraries &amp; Starters
                </Link>
              </li>
              <li>
                <Link
                  href="/?category=ai-automation#catalog"
                  className="transition hover:text-brand-primary"
                >
                  AI &amp; Automation
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#F8FAFC]">
              Portal &amp; Legal
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="transition hover:text-brand-primary"
                >
                  About {SITE_NAME}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="transition hover:text-brand-primary"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="transition hover:text-brand-primary"
                >
                  Contact &amp; Support
                </Link>
              </li>
              <li>
                <Link
                  href="/sitemap.xml"
                  className="transition hover:text-brand-primary"
                >
                  Sitemap XML
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#F8FAFC]">
              Developer Links
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a
                  href={OWNER_PORTFOLIO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 transition hover:text-brand-primary"
                >
                  <Globe className="h-3.5 w-3.5" />
                  <span>shamodha.com ↗</span>
                </a>
              </li>
              <li>
                <a
                  href={OWNER_GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 transition hover:text-brand-primary"
                >
                  <Github className="h-3.5 w-3.5" />
                  <span>github.com/shamodhas ↗</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-800/80 pt-6 text-xs text-slate-500 sm:flex-row">
          <div className="flex flex-wrap items-center gap-4">
            <p>
              © {year} {SITE_NAME} — Built &amp; Maintained by{" "}
              <a
                href={OWNER_PORTFOLIO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 transition hover:text-brand-primary"
              >
                {OWNER_NAME}
              </a>
              . All rights reserved.
            </p>
            <span className="hidden text-slate-700 sm:inline">•</span>
            <div className="flex items-center gap-3 text-slate-400">
              <Link href="/about" className="hover:text-brand-primary">
                About
              </Link>
              <Link href="/privacy" className="hover:text-brand-primary">
                Privacy
              </Link>
              <Link href="/contact" className="hover:text-brand-primary">
                Contact
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <SecretAdminTrigger />
          </div>
        </div>
      </div>
    </footer>
  );
}
