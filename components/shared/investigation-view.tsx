"use client";
import { RefreshCw } from "lucide-react";
import { ResultPresenter } from "@/components/landing/results/result-presenter";
import { ResultSkeleton } from "@/components/landing/results/result-skeleton";
import { useInvestigation } from "@/lib/hooks/use-investigation";
import { InvestigationProblem } from "./investigation-problem";

export function InvestigationView({ id, scope }: { id: string; scope?: string }) {
  const { record, loading, refreshing, problem, retry } = useInvestigation(id, scope);
  if (loading) return <ResultSkeleton />;
  if (!record && problem) return <InvestigationProblem problem={problem} onRetry={retry} id={id} />;
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-end gap-3 text-xs text-slate-500">
        {refreshing && <span aria-live="polite">Memperbarui status…</span>}
        <button
          type="button"
          disabled={refreshing}
          onClick={retry}
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 disabled:opacity-50"
        >
          <RefreshCw className="size-3.5" aria-hidden="true" /> Perbarui status
        </button>
      </div>
      {problem && (
        <div
          role="alert"
          className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
        >
          {problem.message} Tampilan berikut menggunakan data terakhir yang berhasil dimuat.
        </div>
      )}
      <ResultPresenter result={record} />
    </div>
  );
}
