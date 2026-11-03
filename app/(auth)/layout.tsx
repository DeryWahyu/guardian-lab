import Link from "next/link";
import type { ReactNode } from "react";
import { BrandIdentity } from "@/components/shared/brand-identity";
import { PUBLIC_ROUTES } from "@/lib/routes";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background selection:bg-brand-100 selection:text-brand-900 relative flex min-h-screen flex-col justify-between text-slate-800 antialiased">
      {/* Soft warm pastel glow backdrops */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-brand-100/50 absolute -top-32 -left-32 h-96 w-96 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-slate-100/60 blur-3xl" />
        <div className="bg-brand-100/40 absolute -bottom-32 left-1/3 h-96 w-96 rounded-full blur-3xl" />
      </div>

      {/* Auth Navigation Header */}
      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6">
        <Link
          href={PUBLIC_ROUTES.home}
          className="group focus-visible:ring-brand-600 inline-flex cursor-pointer items-center gap-2 rounded-lg p-1 focus-visible:ring-2 focus-visible:outline-none"
        >
          <BrandIdentity markClassName="size-9" />
        </Link>
      </header>

      {/* Centered Auth Card Container */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-8">
        {children}
      </main>

      {/* Footer Disclaimer */}
      <footer className="relative z-10 py-6 text-center text-xs text-slate-500">
        <p>
          &copy; 2026 Guardian Lab &bull; Empowering Digital Guardians Toward a Safer Cyber
          Ecosystem.
        </p>
      </footer>
    </div>
  );
}
