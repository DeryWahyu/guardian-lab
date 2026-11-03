import { ExternalLink, Heart, Shield } from "lucide-react";
import Link from "next/link";
import { ADMIN_ROUTES, PROTECTED_ROUTES, PUBLIC_ROUTES } from "@/lib/routes";
import { BrandIdentity } from "./brand-identity";

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200/80 bg-white text-slate-600 transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5 lg:gap-12">
          {/* Column 1: Brand & Mission (Spans 2 columns on lg) */}
          <div className="space-y-4 lg:col-span-2">
            <Link
              href={PUBLIC_ROUTES.home}
              className="group inline-flex cursor-pointer items-center gap-2.5"
            >
              <BrandIdentity markClassName="size-9" />
            </Link>

            <p className="max-w-sm text-sm leading-relaxed text-slate-500">
              Platform Sandbox Anti-Phishing & Bedah APK yang mengintegrasikan tiga pilar:{" "}
              <strong className="font-semibold text-slate-800">Recognize</strong>,{" "}
              <strong className="font-semibold text-slate-800">Protect</strong>, dan{" "}
              <strong className="font-semibold text-slate-800">Act</strong>. Melindungi pengguna
              dari jebakan cybercrime tanpa kompromi data pribadi.
            </p>

            <div className="border-brand-200/60 bg-brand-50 text-brand-700 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold">
              <Shield className="text-brand-600 size-3.5" />
              <span>MIT-Week 2026: Guardians of the Digital Space</span>
            </div>
          </div>

          {/* Column 2: Fitur Utama */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-wider text-slate-900 uppercase">
              Fitur Utama
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href={PUBLIC_ROUTES.home}
                  className="hover:text-brand-600 cursor-pointer transition-colors"
                >
                  Gateway Deteksi URL
                </Link>
              </li>
              <li>
                <Link
                  href={PUBLIC_ROUTES.sandboxWeb}
                  className="hover:text-brand-600 cursor-pointer transition-colors"
                >
                  Browser Web Sandbox
                </Link>
              </li>
              <li>
                <Link
                  href={PUBLIC_ROUTES.homeWithTab("apk")}
                  className="hover:text-brand-600 cursor-pointer transition-colors"
                >
                  APK X-Ray Engine
                </Link>
              </li>
              <li>
                <Link
                  href={PUBLIC_ROUTES.act}
                  className="hover:text-brand-600 cursor-pointer transition-colors"
                >
                  Guardian Share Card
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Edukasi & Komunitas */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-wider text-slate-900 uppercase">
              Edukasi & Gamifikasi
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href={PROTECTED_ROUTES.academy}
                  className="hover:text-brand-600 cursor-pointer transition-colors"
                >
                  Guardian Academy
                </Link>
              </li>
              <li>
                <Link
                  href={PROTECTED_ROUTES.community}
                  className="hover:text-brand-600 cursor-pointer transition-colors"
                >
                  Community Forensic Replay
                </Link>
              </li>
              <li>
                <Link
                  href={PROTECTED_ROUTES.history}
                  className="hover:text-brand-600 cursor-pointer transition-colors"
                >
                  Riwayat Investigasi
                </Link>
              </li>
              <li>
                <Link
                  href={ADMIN_ROUTES.dashboard}
                  className="hover:text-brand-600 cursor-pointer transition-colors"
                >
                  Dashboard Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Keamanan & Privasi */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-wider text-slate-900 uppercase">
              Keamanan & Privasi
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-1.5 text-slate-500">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                <span>Zero Real PII Scrubber</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-500">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                <span>Auto-Destroy Sandbox 180s</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-500">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                <span>Karantina APK di server</span>
              </li>
              <li>
                <a
                  href="https://nextjs.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex cursor-pointer items-center gap-1 text-slate-500 transition-colors hover:text-slate-800"
                >
                  <span>Dibangun dengan Next.js</span>
                  <ExternalLink className="size-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200/60 pt-8 text-xs text-slate-500 sm:flex-row">
          <p>
            &copy; 2026 Guardian Lab. Dilindungi oleh semangat komunitas keamanan digital Indonesia.
          </p>
          <p className="flex items-center gap-1">
            <span>Dibuat dengan</span>
            <Heart className="fill-brand-500 text-brand-600 size-3.5" />
            <span>untuk ekosistem siber yang lebih aman.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
