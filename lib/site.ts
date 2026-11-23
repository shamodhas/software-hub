export const CANONICAL_SITE_URL = "https://releases.shamodha.com";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL &&
  process.env.NEXT_PUBLIC_SITE_URL.startsWith("http")
    ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, "")
    : CANONICAL_SITE_URL;

export const SITE_NAME = "Software Hub";
export const SITE_DESCRIPTION =
  "Official Software, Cloud, DevOps & AI Engineering releases, standalone executables, open-source toolkits, and developer utilities by Shamodha Sahan (Spring Boot, Node.js/TypeScript, Next.js, Docker/Kubernetes, AI/ML).";

export const OWNER_NAME = "Shamodha Sahan";
export const OWNER_FULL_NAME =
  "Rathnamalala Irugal Bandaralage Shamodha Sahan Rathnamalala";
export const OWNER_EMAIL = "shamodha7@gmail.com";
export const OWNER_LOCATION = "Panadura, Sri Lanka";
export const OWNER_PORTFOLIO_URL = "https://shamodha.com";
export const OWNER_GITHUB_URL = "https://github.com/shamodhas";
export const REPO_GITHUB_URL = "https://github.com/shamodhas/software-hub";
export const ADSENSE_CLIENT_ID =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() ||
  "ca-pub-8135575817026090";

export const SITE_KEYWORDS = [
  "Software Hub",
  "Shamodha Sahan",
  "Rathnamalala Irugal Bandaralage Shamodha Sahan Rathnamalala",
  "releases.shamodha.com",
  "shamodha.com",
  "Software Releases",
  "Open-Source Distribution",
  "Android Mirror",
  "create-node-ss",
  "jwt-security-spring-boot-starter",
  "Spring Boot",
  "Node.js",
  "TypeScript",
  "Next.js",
  "Docker",
  "Kubernetes",
  "DevOps",
  "Cloud Engineering",
  "AI Engineering",
  "Panadura",
  "Sri Lanka",
];

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
    color: "sky",
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
