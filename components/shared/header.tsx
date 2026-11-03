"use client";

import { Flame, Loader2, LockKeyhole, LogOut, Menu, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import type { UserSession } from "@/lib/auth/session";
import { useSessionUser } from "@/lib/hooks/use-session-user";
import { isNavigationActive } from "@/lib/navigation";
import { ADMIN_ROUTES, AUTH_ROUTES, PROTECTED_ROUTES, PUBLIC_ROUTES } from "@/lib/routes";
import { BrandIdentity } from "./brand-identity";

export interface HeaderProps {
  initialUser?: UserSession | null;
}

export function Header({ initialUser }: HeaderProps) {
  return (
    <Suspense>
      <HeaderContent initialUser={initialUser} />
    </Suspense>
  );
}
function HeaderContent({ initialUser }: HeaderProps) {
  const pathname = usePathname();
  const search = useSearchParams();
  const { user, isLoggingOut, handleLogout } = useSessionUser(initialUser);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Gateway", href: PUBLIC_ROUTES.home },
    { label: "Sandbox", href: PUBLIC_ROUTES.sandboxWeb, requiresAuth: true },
    { label: "APK X-Ray", href: PUBLIC_ROUTES.homeWithTab("apk") },
    { label: "Share Card", href: PUBLIC_ROUTES.act, requiresAuth: true },
    { label: "Academy", href: PROTECTED_ROUTES.academy, requiresAuth: true },
    { label: "Community", href: PROTECTED_ROUTES.community, requiresAuth: true },
    { label: "History", href: PROTECTED_ROUTES.history, requiresAuth: true },
  ];

  return (
    <header className="bg-background/85 sticky top-0 z-50 w-full border-b border-slate-200/60 shadow-xs backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          href={PUBLIC_ROUTES.home}
          className="group focus-visible:ring-brand-600 inline-flex cursor-pointer items-center gap-2.5 rounded-xl p-1 focus-visible:ring-2 focus-visible:outline-none"
        >
          <BrandIdentity />
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden items-center gap-1 rounded-full border border-slate-200/40 bg-slate-100/60 p-1.5 xl:flex">
          {navLinks.map((link) => {
            const isActive = isNavigationActive(link.href, pathname, search);
            return (
              <Link
                key={link.label}
                aria-current={isActive ? "page" : undefined}
                href={
                  !user && link.requiresAuth ? AUTH_ROUTES.loginWithRedirect(link.href) : link.href
                }
                title={!user && link.requiresAuth ? "Masuk untuk membuka fitur ini" : undefined}
                className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  isActive
                    ? "text-brand-600 bg-white font-bold shadow-xs"
                    : "text-slate-600 hover:bg-white/50 hover:text-slate-900"
                }`}
              >
                {link.label}
                {!user && link.requiresAuth && (
                  <LockKeyhole aria-hidden="true" className="ml-1 inline size-3" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Auth / Action Area */}
        <div className="hidden items-center gap-3 xl:flex">
          {user ? (
            <div className="flex items-center gap-2.5">
              {/* Daily Streak Flame */}
              <div
                className="inline-flex items-center gap-1 rounded-full border border-orange-200/60 bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-600 shadow-xs"
                title="Daily Streak Aktivitas"
              >
                <Flame className="size-3.5 animate-pulse fill-orange-500 text-orange-500 motion-reduce:animate-none" />
                <span>{user.streakDays}d</span>
              </div>

              {/* EXP Gamification Badge */}
              <div
                className="inline-flex items-center gap-1 rounded-full border border-amber-200/60 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 shadow-xs"
                title="Total EXP Guardian"
              >
                <Sparkles className="size-3.5 text-amber-500" />
                <span>{user.exp || 0} EXP</span>
              </div>

              {/* Admin Badge */}
              {user.role === "ADMIN" && (
                <Link
                  href={ADMIN_ROUTES.dashboard}
                  className="bg-brand-100 text-brand-700 hover:bg-brand-200 cursor-pointer rounded-lg px-2 py-1 text-[10px] font-extrabold tracking-wider uppercase transition-colors"
                >
                  Admin
                </Link>
              )}

              {/* User Avatar Pill */}
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white py-1 pr-3 pl-2 shadow-xs">
                <div className="bg-brand-100 text-brand-700 flex size-6 items-center justify-center rounded-full text-xs font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[100px] truncate text-xs font-semibold text-slate-800">
                  {user.name}
                </span>
              </div>

              {/* Logout Button */}
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="hover:bg-brand-50 hover:text-brand-600 cursor-pointer rounded-full p-2 text-slate-400 transition-colors"
                title="Keluar"
                aria-label="Logout"
              >
                {isLoggingOut ? (
                  <Loader2 className="size-4 animate-spin motion-reduce:animate-none" />
                ) : (
                  <LogOut className="size-4" />
                )}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href={AUTH_ROUTES.login}
                className="bg-brand-600 shadow-brand-200/60 hover:bg-brand-700 cursor-pointer rounded-full px-5 py-2 text-sm font-semibold text-white shadow-md transition-all active:scale-98"
              >
                Masuk
              </Link>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="cursor-pointer rounded-xl p-2 text-slate-600 hover:bg-slate-100 xl:hidden"
          aria-label={mobileMenuOpen ? "Tutup Menu" : "Buka Menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
        >
          {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="space-y-3 border-t border-slate-200 bg-white/95 px-4 py-6 shadow-lg backdrop-blur-md xl:hidden"
        >
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={
                  !user && link.requiresAuth ? AUTH_ROUTES.loginWithRedirect(link.href) : link.href
                }
                title={!user && link.requiresAuth ? "Masuk untuk membuka fitur ini" : undefined}
                onClick={() => setMobileMenuOpen(false)}
                aria-current={isNavigationActive(link.href, pathname, search) ? "page" : undefined}
                className={`hover:bg-brand-50 hover:text-brand-600 cursor-pointer rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${isNavigationActive(link.href, pathname, search) ? "bg-brand-50 text-brand-600" : "text-slate-700"}`}
              >
                {link.label}
                {!user && link.requiresAuth && (
                  <LockKeyhole aria-hidden="true" className="ml-1 inline size-3" />
                )}
              </Link>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-4">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-brand-100 text-brand-700 flex size-8 items-center justify-center rounded-full text-sm font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800">{user.name}</span>
                      <span className="text-xs text-slate-500">{user.email}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="rounded-full bg-orange-50 px-2 py-0.5 text-xs font-bold text-orange-600">
                      🔥 {user.streakDays}d
                    </span>
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700">
                      ⭐ {user.exp || 0}
                    </span>
                  </div>
                </div>
                {user.role === "ADMIN" && (
                  <Link
                    href={ADMIN_ROUTES.dashboard}
                    className="bg-brand-50 text-brand-700 block rounded-xl px-4 py-2.5 text-sm font-semibold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard admin
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="hover:bg-brand-50 hover:text-brand-600 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-slate-100 py-2.5 text-sm font-semibold text-slate-700 transition-colors"
                >
                  <LogOut className="size-4" /> Keluar dari Akun
                </button>
              </div>
            ) : (
              <Link
                href={AUTH_ROUTES.login}
                onClick={() => setMobileMenuOpen(false)}
                className="bg-brand-600 shadow-brand-200 block w-full cursor-pointer rounded-full py-2.5 text-center text-sm font-semibold text-white shadow-md"
              >
                Masuk ke Akun
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
