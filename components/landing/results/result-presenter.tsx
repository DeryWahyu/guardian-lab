"use client";
import { Share2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ApkStaticPanel } from "@/components/apk/apk-static-panel";
import { SandboxLaunchLink } from "@/components/sandbox/sandbox-launch-link";
import { DualModeToggle } from "@/components/shared/dual-mode-toggle";
import { InvestigationMetadata } from "@/components/shared/investigation-metadata";
import { InvestigationStatusPanel } from "@/components/shared/investigation-status-panel";
import { getApkStaticReport } from "@/lib/apk/presentation";
import { getInvestigationResult } from "@/lib/investigations/presentation";
import { PROTECTED_ROUTES, PUBLIC_ROUTES } from "@/lib/routes";
import type { Investigation } from "@/lib/validations/investigation";
import { GeekViewPanel } from "./geek-view-panel";
import { KedokCard } from "./kedok-card";
import { ResultError } from "./result-error";
import { ResultSkeleton } from "./result-skeleton";
import { ThreatScoreGauge } from "./threat-score-gauge";

export interface ResultPresenterProps {
  result: Investigation | null;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  className?: string;
}
function ResultPresenterInner({
  result: record,
  isLoading,
  error,
  onRetry,
  className,
}: ResultPresenterProps) {
  const params = useSearchParams();
  const pathname = usePathname();
  const mode = params.get("mode") === "geek" ? "geek" : "human";
  function searchEvidence(value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set("evidence", value);
    else next.delete("evidence");
    window.history.replaceState(null, "", `${pathname}?${next}`);
  }
  if (isLoading) return <ResultSkeleton className={className} />;
  if (error) return <ResultError message={error} onRetry={onRetry} className={className} />;
  if (!record) return null;
  const result = getInvestigationResult(record);
  const apkReport = getApkStaticReport(record);
  if (!result) return <InvestigationStatusPanel record={record} />;
  return (
    <section
      aria-label="Hasil Analisis Forensik Keamanan"
      className="mx-auto max-w-4xl space-y-6 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-slate-500">Hasil analisis tersimpan</p>
          <h2 className="mt-1 text-xl font-bold text-slate-900">Laporan Investigasi</h2>
        </div>
        <DualModeToggle mode={mode} />
      </div>
      <InvestigationMetadata record={record} />
      {apkReport && (
        <ApkStaticPanel
          report={apkReport}
          mode={mode}
          sha256={
            typeof record.inputMetadata.sha256 === "string"
              ? record.inputMetadata.sha256
              : undefined
          }
        />
      )}
      {mode === "human" ? (
        <div className="grid gap-5 md:grid-cols-2">
          <ThreatScoreGauge
            score={result.riskScore}
            riskLevel={result.riskLevel}
            defangedTarget={result.defangedTarget}
            scamCategory={result.scamCategory}
          />
          <KedokCard
            riskLevel={result.riskLevel}
            scamCategory={result.scamCategory}
            humanFriendlySummary={result.humanFriendlySummary}
            deceptionTricks={result.deceptionTricks}
          />
        </div>
      ) : (
        <GeekViewPanel
          result={result}
          search={params.get("evidence") ?? ""}
          onSearchChange={searchEvidence}
        />
      )}
      <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-4">
        <SandboxLaunchLink target={record.target} type={record.type} investigationId={record.id} />
        <Link
          href={PROTECTED_ROUTES.communitySubmit(record.id)}
          className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700"
        >
          Ajukan ke komunitas
        </Link>
        <Link
          href={PROTECTED_ROUTES.history}
          className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700"
        >
          Kembali ke riwayat
        </Link>
        <Link
          href={PUBLIC_ROUTES.actWithInvestigation(record.id)}
          className="bg-brand-600 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white"
        >
          <Share2 className="size-4" aria-hidden="true" /> Buat Guardian Share Card
        </Link>
      </div>
    </section>
  );
}
export function ResultPresenter(props: ResultPresenterProps) {
  return (
    <Suspense fallback={<ResultSkeleton className={props.className} />}>
      <ResultPresenterInner {...props} />
    </Suspense>
  );
}
