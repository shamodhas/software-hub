"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { SITE_NAME } from "@/lib/site";

export interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  subtitle?: string;
  intervalMs?: number;
  className?: string;
}

const SIZE_CONFIG = {
  sm: {
    container: "h-7 w-7 rounded-lg",
    px: 28,
    titleText: "text-sm",
    badgeText: "text-[9px] px-1.5 py-0.5",
  },
  md: {
    container: "h-10 w-10 rounded-xl",
    px: 40,
    titleText: "text-base",
    badgeText: "text-[10px] px-2 py-0.5",
  },
  lg: {
    container: "h-14 w-14 rounded-2xl",
    px: 56,
    titleText: "text-xl",
    badgeText: "text-xs px-2.5 py-0.5",
  },
} as const;

export function BrandLogo({
  size = "md",
  showLabel = false,
  subtitle,
  intervalMs = 4500,
  className = "",
}: BrandLogoProps) {
  const [activeVariant, setActiveVariant] = useState<"blue" | "gold">("blue");
  const [reducedMotion, setReducedMotion] = useState(false);

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

  useEffect(() => {
    if (reducedMotion) return;

    const timer = setInterval(() => {
      setActiveVariant((prev) => (prev === "blue" ? "gold" : "blue"));
    }, intervalMs);

    return () => clearInterval(timer);
  }, [reducedMotion, intervalMs]);

  const cfg = SIZE_CONFIG[size];
  const isGold = activeVariant === "gold";

  return (
    <div
      className={`inline-flex items-center gap-3 ${className}`}
      onMouseEnter={() =>
        setActiveVariant((prev) => (prev === "blue" ? "gold" : "blue"))
      }
    >
      {/* Animated Dual-Layer Brand Mark Container */}
      <div
        className={`relative flex shrink-0 items-center justify-center overflow-hidden border transition-all duration-1000 ease-in-out ${
          cfg.container
        } ${
          isGold
            ? "border-amber-400/40 bg-amber-500/10 shadow-[0_0_18px_rgba(245,158,11,0.22)]"
            : "border-cyan-400/40 bg-cyan-500/10 shadow-[0_0_18px_rgba(34,211,238,0.22)]"
        }`}
      >
        {/* Subtle ambient radial backlight */}
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            isGold
              ? "bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.22),transparent_75%)] opacity-100"
              : "bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.22),transparent_75%)] opacity-100"
          }`}
        />

        {/* Blue Variant Layer */}
        <Image
          src="/images/logo-blue.png"
          alt={`${SITE_NAME} Blue Emblem`}
          width={cfg.px}
          height={cfg.px}
          priority
          className={`absolute inset-0 h-full w-full object-contain p-0.5 transition-all duration-1000 ease-in-out ${
            !isGold
              ? "scale-100 opacity-100 drop-shadow-[0_0_8px_rgba(34,211,238,0.45)]"
              : "scale-95 opacity-0"
          }`}
        />

        {/* Gold Variant Layer */}
        <Image
          src="/images/logo-gold.png"
          alt={`${SITE_NAME} Gold Emblem`}
          width={cfg.px}
          height={cfg.px}
          priority
          className={`absolute inset-0 h-full w-full object-contain p-0.5 transition-all duration-1000 ease-in-out ${
            isGold
              ? "scale-100 opacity-100 drop-shadow-[0_0_8px_rgba(251,191,36,0.45)]"
              : "scale-95 opacity-0"
          }`}
        />
      </div>

      {/* Optional Brand Typography & Hub Badge */}
      {showLabel && (
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`font-bold tracking-tight text-white ${cfg.titleText}`}
            >
              {SITE_NAME}
            </span>
            <span
              className={`rounded-full border font-mono font-semibold uppercase tracking-wider transition-colors duration-1000 ${
                cfg.badgeText
              } ${
                isGold
                  ? "border-amber-400/35 bg-amber-500/10 text-amber-300"
                  : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              }`}
            >
              Hub
            </span>
          </div>
          {subtitle && (
            <p className="text-xs text-slate-400">{subtitle}</p>
          )}
        </div>
      )}
    </div>
  );
}
