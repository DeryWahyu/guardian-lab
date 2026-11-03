"use client";

import {
  BookOpen,
  ClipboardCheck,
  ExternalLink,
  LayoutDashboard,
  Loader2,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { BrandIdentity } from "@/components/shared/brand-identity";
import type { UserSession } from "@/lib/auth/session";
import { useSessionUser } from "@/lib/hooks/use-session-user";
import { ADMIN_ROUTES, PUBLIC_ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

const navigation = [
  { label: "Dashboard", href: ADMIN_ROUTES.dashboard, icon: LayoutDashboard },
  { label: "Bank soal", href: ADMIN_ROUTES.quizzes, icon: BookOpen },
  { label: "Moderasi kasus", href: ADMIN_ROUTES.communityReviews, icon: ClipboardCheck },
];

export function AdminShell({ user, children }: { user: UserSession; children: ReactNode }) {
  const pathname = usePathname();
  const { isLoggingOut, handleLogout } = useSessionUser(user);
  return (
    <div className="bg-background min-h-screen text-slate-900 lg:flex">
      <aside className="border-b border-slate-200 bg-white lg:fixed lg:inset-y-0 lg:flex lg:w-60 lg:flex-col lg:border-r lg:border-b-0">
        <Link
          href={ADMIN_ROUTES.dashboard}
          className="focus-visible:outline-brand-600 flex items-center gap-3 px-6 py-6 focus-visible:outline-2"
        >
          <BrandIdentity subtitle="Ruang administrator" markClassName="size-9" />
        </Link>
        <nav
          aria-label="Navigasi admin"
          className="grid grid-cols-3 gap-1 px-3 pb-3 lg:flex lg:flex-col lg:px-4 lg:py-5"
        >
          {navigation.map(({ href, label, icon: Icon }) => {
            const active =
              pathname === href ||
              (href !== ADMIN_ROUTES.dashboard && pathname.startsWith(`${href}/`));
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "focus-visible:outline-brand-600 flex flex-col items-center justify-center gap-1.5 rounded-xl px-2 py-3 text-center text-xs font-medium transition-colors focus-visible:outline-2 lg:flex-row lg:justify-start lg:gap-3 lg:px-4 lg:text-left lg:text-sm",
                  active
                    ? "bg-brand-50 text-brand-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                )}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden px-6 py-6 text-xs leading-relaxed text-slate-500 lg:mt-auto lg:block">
          Tinjau temuan, kelola pembelajaran, dan jaga ruang digital bersama.
        </div>
      </aside>
      <div className="min-w-0 flex-1 lg:ml-60">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white/80 px-5 py-4 sm:px-8">
          <Link
            href={PUBLIC_ROUTES.home}
            className="hover:text-brand-700 focus-visible:outline-brand-600 inline-flex items-center gap-2 rounded-lg text-sm text-slate-600 focus-visible:outline-2"
          >
            <ExternalLink className="size-4" />
            Lihat halaman publik
          </Link>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="block max-w-40 truncate text-sm font-semibold">{user.name}</span>
              <span className="text-xs text-slate-500">Administrator</span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              aria-busy={isLoggingOut}
              className="focus-visible:outline-brand-600 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 focus-visible:outline-2 disabled:cursor-wait disabled:opacity-60"
            >
              {isLoggingOut ? (
                <Loader2 className="size-4 animate-spin motion-reduce:animate-none" />
              ) : (
                <LogOut className="size-4" />
              )}
              {isLoggingOut ? "Keluar..." : "Keluar"}
            </button>
          </div>
        </header>
        <main className="mx-auto max-w-7xl p-5 sm:p-8 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
