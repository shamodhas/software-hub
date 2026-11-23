"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { SITE_NAME } from "@/lib/site";

export type BrandThemeMode = "blue" | "gold";

export interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  subtitle?: string;
  intervalMs?: number;
  syncDocumentTheme?: boolean;
  className?: string;
}

const SIZE_CONFIG = {
  sm: {
    container: "h-7 w-7",
    px: 28,
    titleText: "text-sm",
    badgeText: "text-[9px] px-1.5 py-0.5",
  },
  md: {
    container: "h-10 w-10",
    px: 40,
    titleText: "text-base",
    badgeText: "text-[10px] px-2 py-0.5",
  },
  lg: {
    container: "h-14 w-14",
    px: 56,
    titleText: "text-xl",
    badgeText: "text-xs px-2.5 py-0.5",
  },
} as const;

const THEME_EVENT_NAME = "software-hub:brand-theme";

function setGlobalBrandTheme(nextTheme: BrandThemeMode) {
  if (typeof document !== "undefined") {
    document.documentElement.dataset.brandTheme = nextTheme;
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent<BrandThemeMode>(THEME_EVENT_NAME, { detail: nextTheme })
    );
  }
}

export function BrandLogo({
  size = "md",
  showLabel = false,
  subtitle,
  intervalMs = 5000,
  syncDocumentTheme = false,
  className = "",
}: BrandLogoProps) {
  const [activeVariant, setActiveVariant] = useState<BrandThemeMode>("blue");
  const [reducedMotion, setReducedMotion] = useState(false);

  // Sync with global document theme changes so all BrandLogo instances stay in lockstep
  useEffect(() => {
    if (typeof document !== "undefined") {
      const current = document.documentElement.dataset
        .brandTheme as BrandThemeMode | undefined;
      if (current === "gold" || current === "blue") {
        setActiveVariant(current);
      } else {
        document.documentElement.dataset.brandTheme = "blue";
      }
    }

    function handleThemeBroadcast(e: Event) {
      const custom = e as CustomEvent<BrandThemeMode>;
      if (custom.detail === "gold" || custom.detail === "blue") {
        setActiveVariant(custom.detail);
      }
    }

    window.addEventListener(THEME_EVENT_NAME, handleThemeBroadcast);
    return () =>
      window.removeEventListener(THEME_EVENT_NAME, handleThemeBroadcast);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const listener = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  // Only the primary controller instance (Navbar or Login page) drives the interval timer
  useEffect(() => {
    if (!syncDocumentTheme || reducedMotion) return;

    const timer = setInterval(() => {
      const current =
        (document.documentElement.dataset.brandTheme as BrandThemeMode) ||
        "blue";
      const next: BrandThemeMode = current === "blue" ? "gold" : "blue";
      setGlobalBrandTheme(next);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [syncDocumentTheme, reducedMotion, intervalMs]);

  const cfg = SIZE_CONFIG[size];
  const isGold = activeVariant === "gold";

  function handleToggleTheme() {
    const next: BrandThemeMode = isGold ? "blue" : "gold";
    setGlobalBrandTheme(next);
  }

  return (
    <div
      className={`inline-flex items-center gap-3 ${className}`}
      onMouseEnter={handleToggleTheme}
    >
      {/* Transparent Cutout Dual-Logo Cross-Fade Container */}
      <div
        className={`relative flex shrink-0 items-center justify-center bg-transparent ${cfg.container}`}
      >
        {/* Subtle ambient radial aura behind cutout logo */}
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 rounded-full blur-md transition-opacity duration-700 ease-in-out ${
            isGold
              ? "bg-amber-500/25 opacity-100"
              : "bg-sky-400/25 opacity-100"
          }`}
        />

        {/* Blue Cutout Logo Layer */}
        <Image
          src="/images/logo-blue-removebg.png"
          alt={`${SITE_NAME} Blue Emblem`}
          width={cfg.px}
          height={cfg.px}
          priority
          className={`absolute inset-0 h-full w-full object-contain transition-all duration-700 ease-in-out ${
            !isGold
              ? "scale-100 opacity-100 drop-shadow-[0_0_10px_rgba(56,189,248,0.45)]"
              : "scale-95 opacity-0"
          }`}
        />

        {/* Gold Cutout Logo Layer */}
        <Image
          src="/images/logo-gold-removebg.png"
          alt={`${SITE_NAME} Gold Emblem`}
          width={cfg.px}
          height={cfg.px}
          priority
          className={`absolute inset-0 h-full w-full object-contain transition-all duration-700 ease-in-out ${
            isGold
              ? "scale-100 opacity-100 drop-shadow-[0_0_10px_rgba(245,158,11,0.45)]"
              : "scale-95 opacity-0"
          }`}
        />
      </div>

      {/* Optional Brand Typography & Hub Badge */}
      {showLabel && (
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`font-bold tracking-tight text-[#F8FAFC] ${cfg.titleText}`}
            >
              {SITE_NAME}
            </span>
            <span
              className={`brand-badge rounded-full font-mono font-semibold uppercase tracking-wider ${cfg.badgeText}`}
            >
              Hub
            </span>
          </div>
          {subtitle && (
            <p className="text-xs text-[#94A3B8]">{subtitle}</p>
          )}
        </div>
      )}
    </div>
  );
}
