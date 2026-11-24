"use client";

import { useEffect, useRef, useState } from "react";
import { ADSENSE_CLIENT_ID } from "@/lib/site";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export interface AdSlotProps {
  slot: string;
  format?: "auto" | "fluid" | "rectangle" | "horizontal";
  responsive?: boolean;
  className?: string;
}

/**
 * Reusable, CLS-safe Google AdSense slot (`ca-pub-8135575817026090`).
 * Placed strictly outside release cards and download buttons.
 * Handles React StrictMode double-mount, ad blockers, and unfilled/review states cleanly.
 */
export function AdSlot({
  slot,
  format = "auto",
  responsive = true,
  className = "",
}: AdSlotProps) {
  const adClient =
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT || ADSENSE_CLIENT_ID;
  const insRef = useRef<HTMLModElement | null>(null);
  const pushedRef = useRef(false);
  const [unfilled, setUnfilled] = useState(false);

  useEffect(() => {
    const el = insRef.current;
    if (!adClient || !el || pushedRef.current) return;

    // Guard against duplicate push if AdSense already processed this <ins> element
    if (
      el.getAttribute("data-adsbygoogle-status") ||
      el.getAttribute("data-ad-status")
    ) {
      pushedRef.current = true;
      return;
    }

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushedRef.current = true;
    } catch {
      // Silently ignore ad-blocker or pre-approval TagError exceptions
    }

    const observer = new MutationObserver(() => {
      if (el.getAttribute("data-ad-status") === "unfilled") {
        setUnfilled(true);
      }
    });
    observer.observe(el, {
      attributes: true,
      attributeFilter: ["data-ad-status"],
    });

    return () => observer.disconnect();
  }, [adClient, slot]);

  if (!adClient || unfilled) {
    return null;
  }

  return (
    <aside
      aria-label="Advertisement"
      className={`brand-surface-card my-6 overflow-hidden rounded-2xl p-4 ${className}`}
    >
      <div className="mb-2 flex items-center justify-between text-[10px] font-medium uppercase tracking-widest text-[#94A3B8]">
        <span>Advertisement</span>
        <span className="brand-text font-mono text-[9px] opacity-80">
          Sponsored
        </span>
      </div>
      <div className="flex min-h-[100px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#060B14]/60">
        <ins
          ref={insRef}
          className="adsbygoogle block w-full"
          style={{ display: "block", minHeight: "100px" }}
          data-ad-client={adClient}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive ? "true" : "false"}
        />
      </div>
    </aside>
  );
}
