import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface ArtifactSeedInput {
  artifactType:
    | "EXECUTABLE"
    | "PORTABLE_ZIP"
    | "SOURCE_ARCHIVE"
    | "GITHUB_SOURCE"
    | "PACKAGE_REGISTRY";
  label: string;
  fileName?: string | null;
  fileSize?: string | null;
  sha256?: string | null;
  downloadUrl: string;
  devDownloadCount: number;
}

/**
 * Non-destructive artifact upsert:
 * - Preserves existing `downloadCount` if the artifact already exists (crucial for production).
 * - In production mode (`isProd === true`), newly created artifacts start at `downloadCount = 0`.
 * - In development mode (`isProd === false`), newly created artifacts use `devDownloadCount` for realistic local UI testing.
 */
async function upsertReleaseArtifacts(
  releaseId: string,
  artifacts: ArtifactSeedInput[],
  isProd: boolean
) {
  for (const art of artifacts) {
    const existing = await prisma.releaseArtifact.findFirst({
      where: {
        releaseId,
        artifactType: art.artifactType,
        label: art.label,
      },
    });

    if (existing) {
      await prisma.releaseArtifact.update({
        where: { id: existing.id },
        data: {
          fileName: art.fileName ?? null,
          fileSize: art.fileSize ?? null,
          sha256: art.sha256 ?? null,
          downloadUrl: art.downloadUrl,
        },
      });
    } else {
      await prisma.releaseArtifact.create({
        data: {
          releaseId,
          artifactType: art.artifactType,
          label: art.label,
          fileName: art.fileName ?? null,
          fileSize: art.fileSize ?? null,
          sha256: art.sha256 ?? null,
          downloadUrl: art.downloadUrl,
          downloadCount: isProd ? 0 : art.devDownloadCount,
        },
      });
    }
  }
}

async function main() {
  const args = process.argv.slice(2);
  const isProd =
    args.includes("--prod") ||
    (!args.includes("--dev") &&
      (process.env.APP_ENV === "production" ||
        process.env.NODE_ENV === "production"));

  console.log(
    `🌱 Seeding Software Hub database in [${
      isProd ? "PRODUCTION" : "DEVELOPMENT"
    }] mode...`
  );

  // 1. Seed Official Categories (Shared across Dev & Prod)
  const categoriesData = [
    {
      name: "Desktop Utilities",
      slug: "desktop-utilities",
      description:
        "High-performance standalone desktop utilities, system bridges, and developer tools.",
      sortOrder: 1,
    },
    {
      name: "CLI & DevOps",
      slug: "cli-devops",
      description:
        "Command-line scaffolds, automation runners, and developer productivity toolchains.",
      sortOrder: 2,
    },
    {
      name: "Libraries & Starters",
      slug: "libraries-starters",
      description:
        "Production-hardened backend libraries, Spring Boot starters, and modular SDKs.",
      sortOrder: 3,
    },
    {
      name: "AI & Automation",
      slug: "ai-automation",
      description:
        "Intelligent workflow agents, LLM integrations, and automated developer pipelines.",
      sortOrder: 4,
    },
  ];

  const categories: Record<string, { id: string }> = {};
  for (const cat of categoriesData) {
    const upserted = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        sortOrder: cat.sortOrder,
      },
      create: cat,
    });
    categories[cat.slug] = upserted;
  }

  // 2. Seed Production Software #1: Android Mirror
  const androidMirror = await prisma.software.upsert({
    where: { slug: "android-mirror" },
    update: {
      name: "Android Mirror",
      tagline:
        "Zero-config wireless & USB Android screen mirroring utility with automated ADB & scrcpy provisioning.",
      description: `Android Mirror is a lightweight, zero-configuration Windows desktop utility that brings ultra-low-latency Android screen mirroring and control to your PC.

Built on top of ADB and scrcpy, Android Mirror eliminates manual SDK downloads, PATH configuration, and tedious wireless IP pairing. On first execution, it automatically provisions required binaries, detects connected Android devices over USB, configures wireless TCP/IP debugging, and seamlessly handles dynamic Wi-Fi IP shifts across sessions.

### Key Highlights
- **Zero-Configuration Setup**: Auto-downloads and configures ADB and scrcpy binaries out of the box.
- **Resilient Wireless Mode**: Automatically transitions from USB to wireless mirroring and tracks dynamic Wi-Fi IP changes.
- **High Frame-Rate & Low Latency**: Full 60fps+ hardware-decoded mirroring with keyboard and mouse input passthrough.
- **Single-Binary Portability**: Distributed as a clean standalone Windows x64 executable.`,
      categoryId: categories["desktop-utilities"].id,
      platform: "Windows x64",
      license: "MIT",
      status: "PUBLISHED",
      featured: true,
      githubRepoUrl: "https://github.com/shamodhas/android-mirror",
      githubReleasesUrl: "https://github.com/shamodhas/android-mirror/releases",
      docsUrl: "https://github.com/shamodhas/android-mirror#readme",
      requirements: [
        "Windows 10 or Windows 11 (64-bit)",
        "Android device with USB Debugging enabled",
        "Same Wi-Fi network or hotspot for wireless mode",
      ],
      setupSteps: [
        "Download AndroidMirror.exe and double-click to auto-install ADB and scrcpy on first run.",
        "Connect your Android phone via USB once and tap Allow on the USB debugging prompt.",
        "Launch AndroidMirror.exe anytime—dynamic Wi-Fi IP shifts are handled automatically.",
      ],
      iconName: "Smartphone",
    },
    create: {
      slug: "android-mirror",
      name: "Android Mirror",
      tagline:
        "Zero-config wireless & USB Android screen mirroring utility with automated ADB & scrcpy provisioning.",
      description: `Android Mirror is a lightweight, zero-configuration Windows desktop utility that brings ultra-low-latency Android screen mirroring and control to your PC.

Built on top of ADB and scrcpy, Android Mirror eliminates manual SDK downloads, PATH configuration, and tedious wireless IP pairing. On first execution, it automatically provisions required binaries, detects connected Android devices over USB, configures wireless TCP/IP debugging, and seamlessly handles dynamic Wi-Fi IP shifts across sessions.

### Key Highlights
- **Zero-Configuration Setup**: Auto-downloads and configures ADB and scrcpy binaries out of the box.
- **Resilient Wireless Mode**: Automatically transitions from USB to wireless mirroring and tracks dynamic Wi-Fi IP changes.
- **High Frame-Rate & Low Latency**: Full 60fps+ hardware-decoded mirroring with keyboard and mouse input passthrough.
- **Single-Binary Portability**: Distributed as a clean standalone Windows x64 executable.`,
      categoryId: categories["desktop-utilities"].id,
      platform: "Windows x64",
      license: "MIT",
      status: "PUBLISHED",
      featured: true,
      githubRepoUrl: "https://github.com/shamodhas/android-mirror",
      githubReleasesUrl: "https://github.com/shamodhas/android-mirror/releases",
      docsUrl: "https://github.com/shamodhas/android-mirror#readme",
      requirements: [
        "Windows 10 or Windows 11 (64-bit)",
        "Android device with USB Debugging enabled",
        "Same Wi-Fi network or hotspot for wireless mode",
      ],
      setupSteps: [
        "Download AndroidMirror.exe and double-click to auto-install ADB and scrcpy on first run.",
        "Connect your Android phone via USB once and tap Allow on the USB debugging prompt.",
        "Launch AndroidMirror.exe anytime—dynamic Wi-Fi IP shifts are handled automatically.",
      ],
      iconName: "Smartphone",
    },
  });

  const amRelease = await prisma.release.upsert({
    where: {
      softwareId_version: {
        softwareId: androidMirror.id,
        version: "1.0.0",
      },
    },
    update: {
      releaseTitle: "v1.0.0 — Initial Stable Release",
      channel: "STABLE",
      isLatest: true,
      githubTagUrl:
        "https://github.com/shamodhas/android-mirror/releases/tag/v1.0.0",
      changelog: `- Initial stable production release of Android Mirror for Windows x64.
- Automated first-run provisioning of ADB and scrcpy runtime binaries.
- Intelligent wireless IP discovery and auto-reconnection across dynamic Wi-Fi subnets.
- Bundled standalone Windows executable (\`AndroidMirror.exe\`).`,
    },
    create: {
      softwareId: androidMirror.id,
      version: "1.0.0",
      releaseTitle: "v1.0.0 — Initial Stable Release",
      channel: "STABLE",
      isLatest: true,
      githubTagUrl:
        "https://github.com/shamodhas/android-mirror/releases/tag/v1.0.0",
      changelog: `- Initial stable production release of Android Mirror for Windows x64.
- Automated first-run provisioning of ADB and scrcpy runtime binaries.
- Intelligent wireless IP discovery and auto-reconnection across dynamic Wi-Fi subnets.
- Bundled standalone Windows executable (\`AndroidMirror.exe\`).`,
    },
  });

  await upsertReleaseArtifacts(
    amRelease.id,
    [
      {
        artifactType: "EXECUTABLE",
        label: "Windows x64 Standalone Executable (.exe)",
        fileName: "AndroidMirror.exe",
        fileSize: "14.2 MB",
        sha256:
          "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        downloadUrl:
          "https://github.com/shamodhas/android-mirror/releases/download/v1.0.0/AndroidMirror.exe",
        devDownloadCount: 142,
      },
      {
        artifactType: "SOURCE_ARCHIVE",
        label: "Source Code (ZIP)",
        fileName: "android-mirror-1.0.0.zip",
        fileSize: "418 KB",
        downloadUrl:
          "https://github.com/shamodhas/android-mirror/archive/refs/tags/v1.0.0.zip",
        devDownloadCount: 38,
      },
      {
        artifactType: "GITHUB_SOURCE",
        label: "GitHub Source Repository",
        downloadUrl: "https://github.com/shamodhas/android-mirror",
        devDownloadCount: 64,
      },
    ],
    isProd
  );

  // 3. Seed Production Software #2: create-node-ss
  const createNodeSs = await prisma.software.upsert({
    where: { slug: "create-node-ss" },
    update: {
      name: "create-node-ss",
      tagline:
        "Interactive CLI scaffolding tool for production-ready Node.js, Express, and TypeScript microservices.",
      description: `create-node-ss is a modern command-line scaffolding tool designed to bootstrap structured, production-grade Node.js and TypeScript backend applications in seconds.

It configures clean layered architecture (controllers, services, repositories, middlewares), ESLint/Prettier rules, environment validation, Docker readiness, and automated testing setups out of the box.`,
      categoryId: categories["cli-devops"].id,
      platform: "Cross-Platform",
      license: "MIT",
      status: "PUBLISHED",
      featured: true,
      githubRepoUrl: "https://github.com/shamodhas/create-node-ss",
      githubReleasesUrl: "https://github.com/shamodhas/create-node-ss/releases",
      docsUrl: "https://www.npmjs.com/package/create-node-ss",
      requirements: [
        "Node.js v18.0.0 or higher",
        "npm, pnpm, or yarn package manager",
        "Git installed in system PATH",
      ],
      setupSteps: [
        "Run `npx create-node-ss@latest my-app` in your terminal.",
        "Follow the interactive CLI prompts to choose TypeScript/JavaScript and database adapters.",
        "Navigate into `cd my-app` and run `npm run dev` to start the development server.",
      ],
      iconName: "Terminal",
    },
    create: {
      slug: "create-node-ss",
      name: "create-node-ss",
      tagline:
        "Interactive CLI scaffolding tool for production-ready Node.js, Express, and TypeScript microservices.",
      description: `create-node-ss is a modern command-line scaffolding tool designed to bootstrap structured, production-grade Node.js and TypeScript backend applications in seconds.

It configures clean layered architecture (controllers, services, repositories, middlewares), ESLint/Prettier rules, environment validation, Docker readiness, and automated testing setups out of the box.`,
      categoryId: categories["cli-devops"].id,
      platform: "Cross-Platform",
      license: "MIT",
      status: "PUBLISHED",
      featured: true,
      githubRepoUrl: "https://github.com/shamodhas/create-node-ss",
      githubReleasesUrl: "https://github.com/shamodhas/create-node-ss/releases",
      docsUrl: "https://www.npmjs.com/package/create-node-ss",
      requirements: [
        "Node.js v18.0.0 or higher",
        "npm, pnpm, or yarn package manager",
        "Git installed in system PATH",
      ],
      setupSteps: [
        "Run `npx create-node-ss@latest my-app` in your terminal.",
        "Follow the interactive CLI prompts to choose TypeScript/JavaScript and database adapters.",
        "Navigate into `cd my-app` and run `npm run dev` to start the development server.",
      ],
      iconName: "Terminal",
    },
  });

  const cnsRelease = await prisma.release.upsert({
    where: {
      softwareId_version: {
        softwareId: createNodeSs.id,
        version: "2.1.0",
      },
    },
    update: {
      releaseTitle: "v2.1.0 — TypeScript Templates & Docker Compose Presets",
      channel: "STABLE",
      isLatest: true,
      githubTagUrl:
        "https://github.com/shamodhas/create-node-ss/releases/tag/v2.1.0",
      changelog: `- Added clean architecture TypeScript + Express template preset.
- Included pre-configured Dockerfile and docker-compose.yml generation.
- Improved interactive CLI speed and automatic dependency installation.`,
    },
    create: {
      softwareId: createNodeSs.id,
      version: "2.1.0",
      releaseTitle: "v2.1.0 — TypeScript Templates & Docker Compose Presets",
      channel: "STABLE",
      isLatest: true,
      githubTagUrl:
        "https://github.com/shamodhas/create-node-ss/releases/tag/v2.1.0",
      changelog: `- Added clean architecture TypeScript + Express template preset.
- Included pre-configured Dockerfile and docker-compose.yml generation.
- Improved interactive CLI speed and automatic dependency installation.`,
    },
  });

  await upsertReleaseArtifacts(
    cnsRelease.id,
    [
      {
        artifactType: "PACKAGE_REGISTRY",
        label: "NPM Package Registry (npx create-node-ss)",
        fileName: "create-node-ss@2.1.0",
        fileSize: "84 KB",
        downloadUrl: "https://www.npmjs.com/package/create-node-ss",
        devDownloadCount: 315,
      },
      {
        artifactType: "SOURCE_ARCHIVE",
        label: "Source Code Archive (TAR.GZ)",
        fileName: "create-node-ss-2.1.0.tar.gz",
        fileSize: "62 KB",
        downloadUrl:
          "https://github.com/shamodhas/create-node-ss/archive/refs/tags/v2.1.0.tar.gz",
        devDownloadCount: 29,
      },
      {
        artifactType: "GITHUB_SOURCE",
        label: "GitHub Source Repository",
        downloadUrl: "https://github.com/shamodhas/create-node-ss",
        devDownloadCount: 89,
      },
    ],
    isProd
  );

  // 4. Seed Production Software #3: jwt-security-spring-boot-starter
  const jwtStarter = await prisma.software.upsert({
    where: { slug: "jwt-security-spring-boot-starter" },
    update: {
      name: "jwt-security-spring-boot-starter",
      tagline:
        "Zero-boilerplate Spring Boot 3 auto-configuration starter for stateless JWT authentication and RBAC.",
      description: `jwt-security-spring-boot-starter simplifies stateless JWT authentication and role-based access control (RBAC) in Spring Boot 3+ applications.

Instead of rewriting custom SecurityFilterChain boilerplate, token parsers, and exception handlers across every microservice, drop in this starter dependency and configure your secret key, token TTL, and public route matchers directly via \`application.yml\`.`,
      categoryId: categories["libraries-starters"].id,
      platform: "JVM / Spring Boot 3",
      license: "Apache-2.0",
      status: "PUBLISHED",
      featured: true,
      githubRepoUrl:
        "https://github.com/shamodhas/jwt-security-spring-boot-starter",
      githubReleasesUrl:
        "https://github.com/shamodhas/jwt-security-spring-boot-starter/releases",
      docsUrl:
        "https://github.com/shamodhas/jwt-security-spring-boot-starter#readme",
      requirements: [
        "Java 17 or Java 21+",
        "Spring Boot 3.1+ & Spring Security 6+",
        "Maven 3.8+ or Gradle 8+",
      ],
      setupSteps: [
        "Add the `jwt-security-spring-boot-starter` dependency to your `pom.xml` or `build.gradle`.",
        "Configure `jwt.security.secret` and `jwt.security.expiration-ms` in your `application.yml`.",
        "Inject `JwtTokenProvider` to issue tokens and secure endpoints automatically.",
      ],
      iconName: "ShieldCheck",
    },
    create: {
      slug: "jwt-security-spring-boot-starter",
      name: "jwt-security-spring-boot-starter",
      tagline:
        "Zero-boilerplate Spring Boot 3 auto-configuration starter for stateless JWT authentication and RBAC.",
      description: `jwt-security-spring-boot-starter simplifies stateless JWT authentication and role-based access control (RBAC) in Spring Boot 3+ applications.

Instead of rewriting custom SecurityFilterChain boilerplate, token parsers, and exception handlers across every microservice, drop in this starter dependency and configure your secret key, token TTL, and public route matchers directly via \`application.yml\`.`,
      categoryId: categories["libraries-starters"].id,
      platform: "JVM / Spring Boot 3",
      license: "Apache-2.0",
      status: "PUBLISHED",
      featured: true,
      githubRepoUrl:
        "https://github.com/shamodhas/jwt-security-spring-boot-starter",
      githubReleasesUrl:
        "https://github.com/shamodhas/jwt-security-spring-boot-starter/releases",
      docsUrl:
        "https://github.com/shamodhas/jwt-security-spring-boot-starter#readme",
      requirements: [
        "Java 17 or Java 21+",
        "Spring Boot 3.1+ & Spring Security 6+",
        "Maven 3.8+ or Gradle 8+",
      ],
      setupSteps: [
        "Add the `jwt-security-spring-boot-starter` dependency to your `pom.xml` or `build.gradle`.",
        "Configure `jwt.security.secret` and `jwt.security.expiration-ms` in your `application.yml`.",
        "Inject `JwtTokenProvider` to issue tokens and secure endpoints automatically.",
      ],
      iconName: "ShieldCheck",
    },
  });

  const jwtRelease = await prisma.release.upsert({
    where: {
      softwareId_version: {
        softwareId: jwtStarter.id,
        version: "1.2.0",
      },
    },
    update: {
      releaseTitle: "v1.2.0 — Spring Boot 3.3 Support & Refresh Token Rotation",
      channel: "STABLE",
      isLatest: true,
      githubTagUrl:
        "https://github.com/shamodhas/jwt-security-spring-boot-starter/releases/tag/v1.2.0",
      changelog: `- Upgraded auto-configuration compatibility for Spring Boot 3.3 and Spring Security 6.3.
- Added built-in claim extractor and customizable public route ant-matchers.
- Published signed JAR artifacts and Javadocs to Maven Central.`,
    },
    create: {
      softwareId: jwtStarter.id,
      version: "1.2.0",
      releaseTitle: "v1.2.0 — Spring Boot 3.3 Support & Refresh Token Rotation",
      channel: "STABLE",
      isLatest: true,
      githubTagUrl:
        "https://github.com/shamodhas/jwt-security-spring-boot-starter/releases/tag/v1.2.0",
      changelog: `- Upgraded auto-configuration compatibility for Spring Boot 3.3 and Spring Security 6.3.
- Added built-in claim extractor and customizable public route ant-matchers.
- Published signed JAR artifacts and Javadocs to Maven Central.`,
    },
  });

  await upsertReleaseArtifacts(
    jwtRelease.id,
    [
      {
        artifactType: "PACKAGE_REGISTRY",
        label: "Maven Central Artifact (JAR / pom.xml)",
        fileName: "jwt-security-spring-boot-starter-1.2.0.jar",
        fileSize: "48 KB",
        downloadUrl:
          "https://central.sonatype.com/search?q=jwt-security-spring-boot-starter",
        devDownloadCount: 204,
      },
      {
        artifactType: "SOURCE_ARCHIVE",
        label: "Source Code (ZIP)",
        fileName: "jwt-security-spring-boot-starter-1.2.0.zip",
        fileSize: "112 KB",
        downloadUrl:
          "https://github.com/shamodhas/jwt-security-spring-boot-starter/archive/refs/tags/v1.2.0.zip",
        devDownloadCount: 41,
      },
      {
        artifactType: "GITHUB_SOURCE",
        label: "GitHub Source Repository",
        downloadUrl:
          "https://github.com/shamodhas/jwt-security-spring-boot-starter",
        devDownloadCount: 77,
      },
    ],
    isProd
  );

  // 5. Dev vs Prod Environment Separation for Sandbox Draft Records
  if (isProd) {
    // Ensure no dev-only sandbox records exist in Production database
    await prisma.software.deleteMany({
      where: { slug: "dev-sandbox-cli" },
    });
    console.log(
      "🔒 Production seed complete: Only verified production releases present (live download counts preserved)."
    );
  } else {
    // Seed a dev-only DRAFT item for testing Admin CRUD & Draft workflows locally
    await prisma.software.upsert({
      where: { slug: "dev-sandbox-cli" },
      update: {
        name: "Dev Sandbox CLI (Local Draft)",
        tagline:
          "Development-only draft package for testing Admin Panel publish toggles and artifact uploads.",
        description:
          "This entry is only seeded in local development mode (`--dev`) to test draft visibility, release creation, and local multipart file uploads.",
        categoryId: categories["ai-automation"].id,
        platform: "Cross-Platform",
        license: "MIT",
        status: "DRAFT",
        featured: false,
        requirements: ["Node.js v20+"],
        setupSteps: ["Test publishing or uploading an artifact from /admin."],
        iconName: "Code2",
      },
      create: {
        slug: "dev-sandbox-cli",
        name: "Dev Sandbox CLI (Local Draft)",
        tagline:
          "Development-only draft package for testing Admin Panel publish toggles and artifact uploads.",
        description:
          "This entry is only seeded in local development mode (`--dev`) to test draft visibility, release creation, and local multipart file uploads.",
        categoryId: categories["ai-automation"].id,
        platform: "Cross-Platform",
        license: "MIT",
        status: "DRAFT",
        featured: false,
        requirements: ["Node.js v20+"],
        setupSteps: ["Test publishing or uploading an artifact from /admin."],
        iconName: "Code2",
      },
    });
    console.log(
      "🛠️ Development seed complete: Core catalog + local dev draft package seeded."
    );
  }
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
