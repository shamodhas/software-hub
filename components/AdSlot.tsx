"use client";

import { useEffect, useRef } from "react";

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
 * Reusable, CLS-safe Google AdSense slot.
 * Renders nothing (`null`) when `NEXT_PUBLIC_ADSENSE_CLIENT` is not set,
 * ensuring zero broken or empty boxes appear prior to AdSense activation.
 */
export function AdSlot({
  slot,
  format = "auto",
  responsive = true,
  className = "",
}: AdSlotProps) {
  const adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim();
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!adClient || initializedRef.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      initializedRef.current = true;
    } catch {
      // Ignore AdSense push errors (e.g., ad blockers)
    }
  }, [adClient]);

  if (!adClient) {
    return null;
  }

  return (
    <aside
      aria-label="Advertisement"
      className={`my-6 overflow-hidden rounded-2xl border border-slate-800/80 bg-[#0D1424]/70 p-4 ${className}`}
    >
      <div className="mb-2 flex items-center justify-between text-[10px] font-medium uppercase tracking-widest text-[#94A3B8]">
        <span>Advertisement</span>
        <span className="font-mono text-[9px] opacity-75">Sponsored</span>
      </div>
      <div className="flex min-h-[100px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#060B14]/60">
        <ins
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
