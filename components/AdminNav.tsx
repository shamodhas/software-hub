"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  PlusCircle,
  LogOut,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const navItems = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: "/admin/software/new",
      label: "New Software",
      icon: PlusCircle,
      exact: false,
    },
    {
      href: "/admin/categories",
      label: "Categories",
      icon: Layers,
      exact: false,
    },
  ];

  return (
    <div className="border-b border-slate-800/90 bg-[#0D1424]/85">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="brand-badge mr-2 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Admin Control Panel</span>
          </span>

          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                  active
                    ? "brand-btn-primary"
                    : "text-slate-300 hover:bg-[#131D33] hover:text-white"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1 rounded-xl border border-slate-800 bg-[#060B14] px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-brand-border hover:text-white"
          >
            <span>Public Portal</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/20"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
