import { Shield } from "lucide-react";
import { getRiskPresentation } from "@/lib/investigations/presentation";
import { cn } from "@/lib/utils";
import type { ThreatAnalysisResult } from "@/types/analysis";

export interface ThreatScoreGaugeProps {
  score: number;
  riskLevel: ThreatAnalysisResult["riskLevel"];
  defangedTarget: string;
  scamCategory: string;
  className?: string;
}
export function ThreatScoreGauge({
  score,
  riskLevel,
  defangedTarget,
  scamCategory,
  className,
}: ThreatScoreGaugeProps) {
  const risk = getRiskPresentation(riskLevel);
  return (
    <div className={cn("space-y-4 rounded-2xl border border-slate-200 bg-white p-6", className)}>
      <span
        className={cn(
          "inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold",
          risk.color,
          risk.background,
        )}
      >
        <Shield className="size-4" aria-hidden="true" />
        {risk.label}
      </span>
      <div>
        <p className="text-xs font-medium text-slate-500">Skor risiko tersimpan</p>
        <p className="mt-1 text-4xl font-bold text-slate-900">
          {score}
          <span className="text-base font-normal text-slate-500"> / 100</span>
        </p>
      </div>
      <p className="text-sm font-semibold text-slate-800">{scamCategory}</p>
      <p className="font-mono text-xs break-all text-slate-600">{defangedTarget}</p>
      <p className="text-xs text-slate-500">
        Kategori dan skor mengikuti hasil analisis yang tersimpan.
      </p>
    </div>
  );
}
