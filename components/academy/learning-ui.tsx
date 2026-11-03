import Link from "next/link";
import { AUTH_ROUTES } from "@/lib/routes";
export const learningControl =
  "min-h-11 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm focus-visible:outline-2 focus-visible:outline-brand-600 disabled:opacity-50";
export function LearningSkeleton() {
  return (
    <output aria-label="Memuat data" className="space-y-4">
      <div className="h-28 animate-pulse rounded-2xl bg-slate-200" />
      <div className="h-48 animate-pulse rounded-2xl bg-slate-100" />
    </output>
  );
}
export function LearningProblem({ retry }: { retry: () => void }) {
  return (
    <div role="alert" className="space-y-3 rounded-2xl border border-rose-200 bg-white p-6">
      <p>Data belum dapat dimuat. Layanan mungkin belum tersedia atau sesi masuk telah berakhir.</p>
      <div className="flex flex-wrap gap-3">
        <button type="button" className={learningControl} onClick={retry}>
          Coba lagi
        </button>
        <Link className={learningControl} href={AUTH_ROUTES.login}>
          Masuk kembali
        </Link>
      </div>
    </div>
  );
}
