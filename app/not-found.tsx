import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <BrandLogo size="lg" />
      <h1 className="mt-5 text-2xl font-bold text-[#F8FAFC]">
        404 — Software Release Not Found
      </h1>
      <p className="mt-2 text-sm text-[#94A3B8]">
        The requested software package or release artifact does not exist or is
        not currently published.
      </p>
      <Link
        href="/"
        className="brand-btn-primary mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Return to Software Hub Directory</span>
      </Link>
    </div>
  );
}
