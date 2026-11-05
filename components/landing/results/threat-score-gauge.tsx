import { Shield } from "lucide-react";
import { getRiskPresentation } from "@/lib/investigations/presentation";
import { cn } from "@/lib/utils";
import type { UrlModelEvidence } from "@/lib/validations/guardian-ml";
import type { ThreatAnalysisResult } from "@/types/analysis";

export interface ThreatScoreGaugeProps {
  score: number;
  riskLevel: ThreatAnalysisResult["riskLevel"];
  defangedTarget: string;
  scamCategory: string;
  model?: UrlModelEvidence;
  className?: string;
}
export function ThreatScoreGauge({
  score,
  riskLevel,
  defangedTarget,
  scamCategory,
  model,
  className,
}: ThreatScoreGaugeProps) {
  const risk = getRiskPresentation(riskLevel, model);
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
        <p className="text-xs font-medium text-slate-500">
          {model ? "Skor indikator model" : "Skor risiko tersimpan"}
        </p>
        <p className="mt-1 text-4xl font-bold text-slate-900">
          {score}
          <span className="text-base font-normal text-slate-500"> / 100</span>
        </p>
      </div>
      <p className="text-sm font-semibold text-slate-800">{scamCategory}</p>
      <p className="font-mono text-xs break-all text-slate-600">{defangedTarget}</p>
      <p className="text-xs text-slate-500">
        {model
          ? "Kategori mengikuti threshold model pada skor asli sebelum pembulatan. Skor bukan persentase kepastian phishing."
          : "Kategori dan skor mengikuti hasil analisis yang tersimpan."}
      </p>
    </div>
  );
}
