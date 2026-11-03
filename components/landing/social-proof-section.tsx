"use client";
import Link from "next/link";
import { useApiResource } from "@/lib/hooks/use-api-resource";
import { API_ROUTES, PROTECTED_ROUTES } from "@/lib/routes";
import { platformOverviewSchema } from "@/lib/validations/platform";
import { LearningLeaderboard } from "./learning-leaderboard";
export function SocialProofSection() {
  const resource = useApiResource(API_ROUTES.platformOverview, platformOverviewSchema, {
    scope: "public-overview",
  });
  const data = resource.data;
  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl space-y-3">
          <h2 className="text-3xl font-semibold text-slate-900">Belajar dan memeriksa bersama</h2>
          <p className="text-sm leading-relaxed text-slate-600">
            Statistik URL, APK, dan kasus berasal dari aktivitas platform.
          </p>
        </div>
        {resource.loading ? (
          <section
            aria-label="Memuat statistik"
            className="h-40 animate-pulse rounded-2xl bg-slate-200 motion-reduce:animate-none"
          />
        ) : resource.problem || !data ? (
          <div role="alert" className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
            <p>Statistik belum dapat dimuat.</p>
            <button
              type="button"
              onClick={resource.retry}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm"
            >
              Coba lagi
            </button>
          </div>
        ) : (
          <dl className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Tautan URL/QR diajukan", count: data.links },
              { label: "APK diunggah untuk diperiksa", count: data.apks },
              { label: "Kasus komunitas disetujui", count: data.cases },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-5">
                <dt className="text-sm text-slate-500">{item.label}</dt>
                <dd className="mt-2 text-3xl font-semibold text-slate-900 tabular-nums">
                  {item.count.toLocaleString("id-ID")}
                </dd>
              </div>
            ))}
          </dl>
        )}
        <div className="grid gap-6 lg:grid-cols-2">
          <LearningLeaderboard />
          <div className="flex flex-col justify-between gap-5 rounded-2xl border border-slate-200 bg-white p-6">
            <div className="space-y-3">
              <h3 className="text-xl font-semibold">Pelajari kasus yang sudah ditinjau</h3>
              <p className="max-w-xl text-sm leading-relaxed text-slate-600">
                Kasus komunitas berasal dari hasil investigasi yang diajukan pemilik dan disetujui
                admin. Baca bukti, lalu uji pemahamanmu melalui latihan kasus.
              </p>
            </div>
            <Link
              href={PROTECTED_ROUTES.community}
              className="text-brand-700 inline-flex min-h-11 items-center font-semibold underline"
            >
              Jelajahi kasus komunitas
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
