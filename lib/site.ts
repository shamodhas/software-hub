export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:4000";

export const SITE_NAME = "Shamodha Releases";
export const SITE_DESCRIPTION =
  "Official Software Releases, Standalone Executables, CLI Toolchains, and Open-Source Distribution Hub by Shamodha Sahan.";
export const OWNER_NAME = "Shamodha Sahan";
export const OWNER_PORTFOLIO_URL = "https://shamodha.com";
export const OWNER_GITHUB_URL = "https://github.com/shamodhas";

export const ARTIFACT_TYPE_META: Record<
  string,
  {
    title: string;
    badge: string;
    color: string;
    order: number;
  }
> = {
  EXECUTABLE: {
    title: "Compiled Executable / Binary",
    badge: "Executable Binary",
    color: "emerald",
    order: 1,
  },
  PORTABLE_ZIP: {
    title: "Portable Binary Archive",
    badge: "Portable ZIP",
    color: "cyan",
    order: 2,
  },
  PACKAGE_REGISTRY: {
    title: "Package Registry Distribution",
    badge: "Registry Package",
    color: "amber",
    order: 3,
  },
  SOURCE_ARCHIVE: {
    title: "Source Code Archive",
    badge: "Source Archive",
    color: "violet",
    order: 4,
  },
  GITHUB_SOURCE: {
    title: "GitHub Source & Releases",
    badge: "GitHub Source",
    color: "slate",
    order: 5,
  },
};

