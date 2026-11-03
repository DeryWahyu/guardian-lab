import { FileSearch } from "lucide-react";
import { getRiskPresentation } from "@/lib/investigations/presentation";
import { cn } from "@/lib/utils";
import type { ThreatAnalysisResult } from "@/types/analysis";

export interface KedokCardProps {
  riskLevel: ThreatAnalysisResult["riskLevel"];
  scamCategory: string;
  humanFriendlySummary: string;
  deceptionTricks?: string[];
  className?: string;
}
export function KedokCard({
  riskLevel,
  scamCategory,
  humanFriendlySummary,
  deceptionTricks = [],
  className,
}: KedokCardProps) {
  const risk = getRiskPresentation(riskLevel);
  return (
    <div className={cn("space-y-5 rounded-2xl border border-slate-200 bg-white p-6", className)}>
      <div className="flex items-start gap-3">
        <FileSearch className="size-6 shrink-0 text-slate-500" aria-hidden="true" />
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            {risk.high && deceptionTricks.length
              ? "Kedok Penipu Terbongkar"
              : "Ringkasan Hasil Analisis"}
          </h3>
          <p className="mt-1 text-xs text-slate-500">{scamCategory}</p>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-slate-700">{humanFriendlySummary}</p>
      <div>
        <h4 className="mb-3 text-xs font-semibold text-slate-500">Temuan yang tercatat</h4>
        {deceptionTricks.length ? (
          <ul className="space-y-2 text-sm text-slate-700">
            {deceptionTricks.map((trick, index) => (
              <li key={`${index}-${trick}`} className="rounded-xl bg-slate-50 p-3">
                {trick}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500">Tidak ada catatan tambahan pada hasil ini.</p>
        )}
      </div>
    </div>
  );
}
