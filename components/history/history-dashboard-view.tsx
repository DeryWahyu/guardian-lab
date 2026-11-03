"use client";
import { FileSearch, RefreshCw } from "lucide-react";
import Link from "next/link";
import { InvestigationProblem } from "@/components/shared/investigation-problem";
import { PROTECTED_ROUTES, PUBLIC_ROUTES } from "@/lib/routes";
import { HistoryCard } from "./history-card";
import { HistoryFilters } from "./history-filters";
import { useHistory } from "./use-history";

export function HistoryDashboardView({ accessScope }: { accessScope?: string }) {
  const history = useHistory(accessScope);
  const { data, loading, refreshing, problem } = history;
  const statistics = [
    ["Investigasi sesuai filter", data?.summary.total],
    ["Hasil berisiko tinggi", data?.summary.highRisk],
    ["Model belum tersedia", data?.summary.unavailable],
  ] as const;
  const outsidePage = data && data.pagination.page > data.pagination.totalPages;
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        {statistics.map(([label, value]) => (
          <div key={label} className="rounded-3xl border border-slate-200 bg-white p-5">
            <p className="text-2xl font-bold text-slate-900">{value ?? "—"}</p>
            <p className="mt-1 text-xs text-slate-500">{label}</p>
          </div>
        ))}
      </div>
      <HistoryFilters values={history.values} onChange={history.setFilter} />
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <p>
          {data
            ? `${data.pagination.total} investigasi ditemukan`
            : loading
              ? "Memuat riwayat…"
              : "Riwayat belum dapat ditampilkan."}
        </p>
        <div className="flex gap-3">
          <Link
            href={PROTECTED_ROUTES.history}
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-slate-700"
          >
            Hapus filter
          </Link>
          <button
            type="button"
            disabled={refreshing || !history.filters}
            onClick={history.retry}
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-slate-700 disabled:opacity-50"
          >
            <RefreshCw className="size-3.5" aria-hidden="true" />
            Perbarui riwayat
          </button>
        </div>
      </div>
      {loading ? (
        <section aria-label="Memuat riwayat" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((key) => (
            <div
              key={key}
              className="h-48 animate-pulse rounded-3xl bg-slate-100 motion-reduce:animate-none"
            />
          ))}
        </section>
      ) : !data && problem ? (
        <InvestigationProblem problem={problem} onRetry={history.retry} />
      ) : (
        data && (
          <div className="space-y-5">
            {problem && (
              <p
                role="alert"
                className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900"
              >
                {problem.message} Daftar berikut menggunakan data terakhir yang berhasil dimuat.
              </p>
            )}
            {data.records.length ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {data.records.map((record) => (
                  <HistoryCard key={record.id} record={record} />
                ))}
              </div>
            ) : (
              <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-8 text-center">
                <FileSearch className="mx-auto size-8 text-slate-400" aria-hidden="true" />
                <h2 className="text-lg font-bold text-slate-900">
                  {outsidePage
                    ? "Halaman tidak tersedia"
                    : history.hasFilters
                      ? "Tidak ada investigasi yang cocok"
                      : "Belum ada investigasi"}
                </h2>
                <p className="text-sm text-slate-500">
                  {outsidePage
                    ? "Buka halaman pertama untuk melihat rekaman yang tersedia."
                    : history.hasFilters
                      ? "Ubah atau hapus filter untuk melihat rekaman lain."
                      : "Mulai dengan memasukkan URL, gambar QR, atau berkas APK."}
                </p>
                <Link
                  className="bg-brand-600 inline-flex rounded-full px-5 py-2 text-sm font-semibold text-white"
                  href={
                    outsidePage || history.hasFilters
                      ? PROTECTED_ROUTES.history
                      : PUBLIC_ROUTES.home
                  }
                >
                  {outsidePage || history.hasFilters
                    ? "Lihat semua investigasi"
                    : "Mulai investigasi"}
                </Link>
              </div>
            )}
            {data.pagination.total > 0 && (
              <nav
                aria-label="Pagination riwayat"
                className="flex flex-wrap items-center justify-between gap-3 text-sm"
              >
                <p className="text-slate-500">
                  Halaman {data.pagination.page} dari {data.pagination.totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={data.pagination.page <= 1}
                    onClick={() => history.setFilter("page", String(data.pagination.page - 1))}
                    className="rounded-full border border-slate-300 bg-white px-4 py-2 disabled:opacity-40"
                  >
                    Sebelumnya
                  </button>
                  <button
                    type="button"
                    disabled={data.pagination.page >= data.pagination.totalPages}
                    onClick={() => history.setFilter("page", String(data.pagination.page + 1))}
                    className="rounded-full border border-slate-300 bg-white px-4 py-2 disabled:opacity-40"
                  >
                    Berikutnya
                  </button>
                </div>
              </nav>
            )}
          </div>
        )
      )}
    </div>
  );
}
