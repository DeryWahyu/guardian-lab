"use client";
import Link from "next/link";
import { ResultSkeleton } from "@/components/landing/results/result-skeleton";
import { InvestigationProblem } from "@/components/shared/investigation-problem";
import { WorkspaceEmpty } from "@/components/workspace/workspace-state";
import workspace from "@/components/workspace/workspace.module.css";
import { ADMIN_ROUTES, PROTECTED_ROUTES } from "@/lib/routes";
import { CommunityCard } from "./community-card";
import { useCommunityList } from "./use-community-list";

const control =
  "min-h-11 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-brand-600";
export function CommunityCasesView({ scope, admin = false }: { scope: string; admin?: boolean }) {
  const list = useCommunityList(scope, admin);
  const query = list.query;
  if (!query)
    return (
      <div className="space-y-3 rounded-xl border bg-white p-6">
        <p>Filter komunitas tidak valid.</p>
        <Link
          href={admin ? ADMIN_ROUTES.communityReviews : PROTECTED_ROUTES.community}
          className="underline"
        >
          Hapus filter
        </Link>
      </div>
    );
  return (
    <div className="space-y-5">
      {!admin && (
        <div className={workspace.notice}>
          <p className="max-w-xl text-sm text-slate-600">
            Kasus berasal dari hasil pemeriksaan yang diajukan pengguna dan ditinjau admin.
            Identitas pengaju tidak ditampilkan.
          </p>
        </div>
      )}
      <div className="flex flex-wrap items-end gap-3">
        {!admin && (
          <label className="space-y-1 text-xs font-semibold text-slate-600">
            Tampilan
            <select
              aria-label="Tampilan komunitas"
              value={query.view}
              onChange={(e) => list.change("view", e.target.value)}
              className={`${control} block`}
            >
              <option value="published">Kasus disetujui</option>
              <option value="mine">Pengajuan saya</option>
            </select>
          </label>
        )}
        {(admin || query.view === "mine") && (
          <label className="space-y-1 text-xs font-semibold text-slate-600">
            Status
            <select
              aria-label="Status pengajuan"
              value={query.status ?? (admin ? "PENDING_REVIEW" : "")}
              onChange={(e) => list.change("status", e.target.value)}
              className={`${control} block`}
            >
              {!admin && <option value="">Semua status</option>}
              <option value="PENDING_REVIEW">Menunggu tinjauan</option>
              <option value="APPROVED">Disetujui</option>
              <option value="REJECTED">Ditolak</option>
            </select>
          </label>
        )}
        <label className="space-y-1 text-xs font-semibold text-slate-600">
          Jenis
          <select
            aria-label="Jenis investigasi"
            value={query.type ?? ""}
            onChange={(e) => list.change("type", e.target.value)}
            className={`${control} block`}
          >
            <option value="">Semua jenis</option>
            {["URL", "QR", "APK"].map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-xs font-semibold text-slate-600">
          Cari kasus (Opsional)
          <input
            type="search"
            placeholder="Cari judul atau ringkasan"
            aria-label="Cari kasus"
            maxLength={150}
            value={query.q}
            onChange={(e) => list.change("q", e.target.value)}
            className={`${control} block`}
          />
        </label>
        <button
          type="button"
          onClick={list.retry}
          disabled={list.refreshing || list.loading}
          className={control}
        >
          {list.refreshing ? "Memperbarui…" : "Perbarui daftar"}
        </button>
      </div>
      {list.loading ? (
        <ResultSkeleton />
      ) : list.problem ? (
        <InvestigationProblem problem={list.problem} onRetry={list.retry} />
      ) : (
        list.data && (
          <>
            <p aria-live="polite" className="text-sm text-slate-500">
              {list.data.pagination.total} kasus ditemukan
            </p>
            {list.data.items.length ? (
              <div className="grid gap-4 md:grid-cols-2">
                {list.data.items.map((item) => (
                  <CommunityCard
                    key={item.id}
                    item={item}
                    presentation={admin ? "default" : "workspace"}
                  />
                ))}
              </div>
            ) : admin ? (
              <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-8 text-center">
                <h2 className="font-bold text-slate-900">
                  {query.page > list.data.pagination.totalPages
                    ? "Halaman di luar daftar"
                    : query.q || query.type
                      ? "Tidak ada kasus yang cocok"
                      : "Belum ada kasus pada daftar ini"}
                </h2>
                <p className="text-sm text-slate-600">
                  {admin
                    ? "Pengajuan baru akan muncul setelah pengguna mengirimkannya."
                    : query.view === "mine"
                      ? "Ajukan hasil lengkap dari riwayat investigasi Anda."
                      : "Kasus akan tampil setelah disetujui admin."}
                </p>
              </div>
            ) : (
              <WorkspaceEmpty
                pose="community"
                title={
                  query.page > list.data.pagination.totalPages
                    ? "Halaman di luar daftar"
                    : query.q || query.type
                      ? "Tidak ada kasus yang cocok"
                      : query.view === "mine"
                        ? "Belum ada pengajuanmu."
                        : "Belum ada kasus pada daftar ini"
                }
                description={
                  query.page > list.data.pagination.totalPages
                    ? "Buka halaman pertama untuk melihat kasus yang tersedia."
                    : query.q || query.type
                      ? "Ubah pencarian atau jenis investigasi untuk menemukan kasus lain."
                      : query.view === "mine"
                        ? "Pilih hasil investigasi lengkap dari riwayat, lalu tinjau snapshot sebelum mengajukannya."
                        : "Kasus akan tampil setelah disetujui admin. Kamu dapat belajar melalui Academy sementara itu."
                }
              >
                <Link
                  href={
                    query.page > list.data.pagination.totalPages || query.q || query.type
                      ? query.view === "mine"
                        ? PROTECTED_ROUTES.communityMine
                        : PROTECTED_ROUTES.community
                      : query.view === "mine"
                        ? PROTECTED_ROUTES.history
                        : PROTECTED_ROUTES.academy
                  }
                  className={workspace.primary}
                >
                  {query.page > list.data.pagination.totalPages || query.q || query.type
                    ? "Lihat semua kasus"
                    : query.view === "mine"
                      ? "Buka riwayat"
                      : "Belajar di Academy"}
                </Link>
              </WorkspaceEmpty>
            )}
            <nav
              aria-label="Halaman kasus"
              className="flex flex-wrap items-center justify-between gap-3 text-sm"
            >
              <button
                type="button"
                disabled={query.page <= 1}
                onClick={() => list.change("page", String(query.page - 1))}
                className={`${control} disabled:opacity-50`}
              >
                Sebelumnya
              </button>
              <span>
                Halaman {query.page} dari {list.data.pagination.totalPages}
              </span>
              <button
                type="button"
                disabled={query.page >= list.data.pagination.totalPages}
                onClick={() => list.change("page", String(query.page + 1))}
                className={`${control} disabled:opacity-50`}
              >
                Berikutnya
              </button>
            </nav>
          </>
        )
      )}
    </div>
  );
}
