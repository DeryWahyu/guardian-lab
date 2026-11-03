import { Activity, BookOpen, ClipboardCheck, FileSearch, ShieldCheck, Users } from "lucide-react";
import Link from "next/link";
import type { AdminDashboardData } from "@/lib/admin/dashboard";
import { INVESTIGATION_STATUS_LABELS } from "@/lib/investigations/presentation";
import { ADMIN_ROUTES, PROTECTED_ROUTES } from "@/lib/routes";

export function DashboardView({ data }: { data: AdminDashboardData }) {
  const statistics = [
    { label: "Guardian terdaftar", value: data.users, icon: Users },
    { label: "Total investigasi", value: data.investigations, icon: FileSearch },
    { label: "Sesi sandbox aktif", value: data.activeSessions, icon: Activity },
    { label: "Menunggu moderasi", value: data.pendingReviews, icon: ClipboardCheck },
  ];
  return (
    <div className="space-y-8">
      <div className="max-w-2xl space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Dashboard admin</h1>
        <p className="text-sm leading-relaxed text-slate-500 sm:text-base">
          Pantau investigasi dan bantu temuan komunitas menjadi peringatan yang berguna.
        </p>
      </div>
      <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statistics.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5">
            <dt className="flex items-center justify-between gap-2 text-sm text-slate-500">
              {label}
              <Icon className="text-brand-600 size-4" />
            </dt>
            <dd className="mt-3 text-3xl font-semibold tabular-nums">
              {value.toLocaleString("id-ID")}
            </dd>
          </div>
        ))}
      </dl>
      <div className="grid gap-6 xl:grid-cols-2">
        <section
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
          aria-labelledby="review-queue-title"
        >
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-6 py-5">
            <h2 id="review-queue-title" className="font-semibold">
              Perlu ditinjau
            </h2>
            <Link
              href={ADMIN_ROUTES.communityReviews}
              className="text-brand-700 focus-visible:outline-brand-600 rounded text-sm font-medium focus-visible:outline-2"
            >
              Buka moderasi
            </Link>
          </div>
          {data.reviewQueue.length ? (
            <ul className="divide-y divide-slate-100">
              {data.reviewQueue.map((review) => (
                <li key={review.id} className="space-y-1 px-6 py-4">
                  <p className="truncate text-sm font-medium">{review.title}</p>
                  <p className="text-xs text-slate-500">{review.scamType}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex min-h-52 flex-col items-start justify-center gap-3 px-6 py-8">
              <ShieldCheck className="size-7 text-emerald-600" />
              <p className="font-medium">Antrean moderasi kosong</p>
              <p className="max-w-sm text-sm leading-relaxed text-slate-500">
                Temuan baru dari komunitas akan muncul di sini untuk diperiksa sebelum diterbitkan.
              </p>
            </div>
          )}
        </section>
        <section
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
          aria-labelledby="investigations-title"
        >
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-6 py-5">
            <h2 id="investigations-title" className="font-semibold">
              Investigasi terbaru
            </h2>
            <Link
              href={PROTECTED_ROUTES.history}
              className="text-brand-700 focus-visible:outline-brand-600 rounded text-sm font-medium focus-visible:outline-2"
            >
              Lihat riwayat
            </Link>
          </div>
          {data.recentInvestigations.length ? (
            <ul className="divide-y divide-slate-100">
              {data.recentInvestigations.map((record) => (
                <li key={record.id} className="flex items-center gap-3 px-6 py-4">
                  <div className="min-w-0 flex-1">
                    <Link
                      href={PROTECTED_ROUTES.historyDetail(record.id)}
                      className="hover:text-brand-700 focus-visible:outline-brand-600 block truncate rounded text-sm font-medium focus-visible:outline-2"
                    >
                      {record.defangedTarget}
                    </Link>
                    <p className="mt-1 text-xs text-slate-500">{record.type}</p>
                  </div>
                  <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-medium tabular-nums">
                    {record.analysisSource === "LEGACY_UNVERIFIED"
                      ? "Rekaman lama"
                      : record.riskScore === null
                        ? INVESTIGATION_STATUS_LABELS[record.status]
                        : `${record.riskScore}/100`}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex min-h-52 flex-col items-start justify-center gap-3 px-6 py-8">
              <FileSearch className="size-7 text-slate-400" />
              <p className="font-medium">Belum ada investigasi</p>
              <p className="max-w-sm text-sm leading-relaxed text-slate-500">
                Hasil pemeriksaan URL, QR, dan APK akan tercatat setelah pengguna melakukan
                analisis.
              </p>
            </div>
          )}
        </section>
      </div>
      <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center gap-3">
          <BookOpen className="text-brand-600 size-5" />
          <div>
            <h2 className="font-semibold">Ruang belajar Guardian</h2>
            <p className="mt-1 text-sm text-slate-500">
              {data.quizzes.toLocaleString("id-ID")} kuis tersedia di bank soal.
            </p>
          </div>
        </div>
        <Link
          href={ADMIN_ROUTES.quizzes}
          className="bg-brand-600 hover:bg-brand-700 focus-visible:outline-brand-600 rounded-xl px-4 py-2.5 text-sm font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Kelola bank soal
        </Link>
      </section>
    </div>
  );
}
