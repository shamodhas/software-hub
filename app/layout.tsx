import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  CANONICAL_SITE_URL,
  OWNER_EMAIL,
  OWNER_FULL_NAME,
  OWNER_GITHUB_URL,
  OWNER_LOCATION,
  OWNER_NAME,
  OWNER_PORTFOLIO_URL,
  REPO_GITHUB_URL,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
} from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(CANONICAL_SITE_URL),
  title: {
    default: `${SITE_NAME} — Software, Cloud, DevOps & AI Engineering Releases by ${OWNER_NAME}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  applicationName: SITE_NAME,
  category: "technology",
  authors: [
    { name: OWNER_NAME, url: OWNER_PORTFOLIO_URL },
    { name: OWNER_FULL_NAME, url: OWNER_GITHUB_URL },
  ],
  creator: OWNER_NAME,
  publisher: OWNER_NAME,
  icons: {
    icon: "/images/logo-blue.png",
    shortcut: "/images/logo-blue.png",
    apple: "/images/logo-gold.png",
  },
  alternates: {
    canonical: CANONICAL_SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: CANONICAL_SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Software, Cloud, DevOps & AI Engineering Releases by ${OWNER_NAME}`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/images/logo-blue.png",
        width: 512,
        height: 512,
        alt: `${SITE_NAME} — ${OWNER_NAME}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Software, Cloud, DevOps & AI Engineering Releases by ${OWNER_NAME}`,
    description: SITE_DESCRIPTION,
    images: ["/images/logo-blue.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const rootJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${OWNER_PORTFOLIO_URL}/#person`,
      name: OWNER_NAME,
      alternateName: OWNER_FULL_NAME,
      url: OWNER_PORTFOLIO_URL,
      email: `mailto:${OWNER_EMAIL}`,
      jobTitle: "Software, Cloud, DevOps & AI Engineer",
      knowsAbout: [
        "Spring Boot",
        "Node.js",
        "TypeScript",
        "Next.js",
        "Docker",
        "Kubernetes",
        "Cloud Architecture",
        "DevOps Engineering",
        "AI & Machine Learning",
      ],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Panadura",
        addressCountry: "LK",
        description: OWNER_LOCATION,
      },
      sameAs: [OWNER_PORTFOLIO_URL, OWNER_GITHUB_URL, REPO_GITHUB_URL],
    },
    {
      "@type": "WebSite",
      "@id": `${CANONICAL_SITE_URL}/#website`,
      url: CANONICAL_SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      inLanguage: "en-US",
      publisher: {
        "@id": `${OWNER_PORTFOLIO_URL}/#person`,
      },
      creator: {
        "@id": `${OWNER_PORTFOLIO_URL}/#person`,
      },
      isPartOf: {
        "@type": "WebSite",
        name: "Shamodha Sahan Portfolio",
        url: OWNER_PORTFOLIO_URL,
      },
    },
    {
      "@type": "CollectionPage",
      "@id": `${CANONICAL_SITE_URL}/#collectionpage`,
      url: CANONICAL_SITE_URL,
      name: `${SITE_NAME} — Official Software & Open-Source Releases`,
      description: SITE_DESCRIPTION,
      isPartOf: {
        "@id": `${CANONICAL_SITE_URL}/#website`,
      },
      author: {
        "@id": `${OWNER_PORTFOLIO_URL}/#person`,
      },
      about: {
        "@type": "SoftwareApplication",
        name: SITE_NAME,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Windows, Linux, macOS, Cross-Platform",
        url: CANONICAL_SITE_URL,
        author: {
          "@id": `${OWNER_PORTFOLIO_URL}/#person`,
        },
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(rootJsonLd) }}
        />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
