"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/**
 * Provides stealth owner access to the Admin Console without rendering any
 * discoverable <a href="/admin"> link or visible button in the public DOM:
 * 1. Keyboard shortcut anywhere on the portal: Ctrl + Shift + A
 * 2. Secret triple-click (3 rapid clicks within 1.2s) on the footer registry status indicator.
 */
export function SecretAdminTrigger() {
  const router = useRouter();
  const clickCountRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey && e.shiftKey && (e.key === "A" || e.key === "a")) {
        e.preventDefault();
        router.push("/admin");
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  function handleSecretClick() {
    clickCountRef.current += 1;
    if (timerRef.current) clearTimeout(timerRef.current);

    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      router.push("/admin");
      return;
    }

    timerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 1200);
  }

  return (
    <span
      onClick={handleSecretClick}
      className="inline-flex select-none items-center gap-1.5 font-mono text-[11px] text-slate-400"
    >
      <span
        className="brand-transition h-2 w-2 rounded-full"
        style={{
          backgroundColor: "var(--brand-primary)",
          boxShadow: "0 0 8px var(--brand-glow)",
        }}
      />
      Release Registry Active
    </span>
  );
}
