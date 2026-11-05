import { FileCode2, FileSearch, Globe, QrCode } from "lucide-react";
import Link from "next/link";
import workspace from "@/components/workspace/workspace.module.css";
import {
  getInvestigationLabel,
  getInvestigationMessage,
  getInvestigationResult,
} from "@/lib/investigations/presentation";
import { PROTECTED_ROUTES } from "@/lib/routes";
import type { Investigation } from "@/lib/validations/investigation";

export type HistoryRecordItem = Investigation;

export function HistoryCard({ record }: { record: Investigation }) {
  const result = getInvestigationResult(record);
  const Icon = record.type === "APK" ? FileCode2 : record.type === "QR" ? QrCode : Globe;
  return (
    <article className={workspace.historyRow}>
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-2 text-xs font-bold text-slate-600">
            <Icon className="size-4" /> {record.type}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
            <FileSearch className="size-3.5" />
            {result ? `Skor: ${result.riskScore}/100` : getInvestigationLabel(record)}
          </span>
        </div>
        <h3 className="text-sm font-bold text-slate-900">
          {result?.scamCategory ?? "Rekaman investigasi"}
        </h3>
        <p className="line-clamp-2 font-mono text-xs break-all text-slate-600">
          {record.defangedTarget}
        </p>
        <p className="line-clamp-2 text-xs text-slate-600">
          {result?.humanFriendlySummary ?? getInvestigationMessage(record)}
        </p>
      </div>
      <div className={workspace.historyRowActions}>
        <time dateTime={record.createdAt}>
          {new Date(record.createdAt).toLocaleDateString("id-ID")}
        </time>
        <Link
          href={PROTECTED_ROUTES.historyDetail(record.id)}
          className="text-brand-600 hover:text-brand-700 font-semibold"
        >
          Lihat rekaman &rarr;
        </Link>
      </div>
    </article>
  );
}
