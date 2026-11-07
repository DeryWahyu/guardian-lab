import {
  ArrowRight,
  Box,
  CircleAlert,
  Clock3,
  FileCode2,
  FileSearch,
  Globe,
  QrCode,
} from "lucide-react";
import Link from "next/link";
import {
  getInvestigationLabel,
  getInvestigationMessage,
  getInvestigationResult,
  getRiskPresentation,
} from "@/lib/investigations/presentation";
import { PROTECTED_ROUTES } from "@/lib/routes";
import type { Investigation } from "@/lib/validations/investigation";
import { formatHistoryDate } from "./history-presentation";
import styles from "./history-table.module.css";

export function HistoryRow({ record }: { record: Investigation }) {
  const result = getInvestigationResult(record);
  const model = result?.technicalEvidence.urlModel;
  const Icon = record.type === "APK" ? FileCode2 : record.type === "QR" ? QrCode : Globe;
  const StatusIcon =
    record.status === "PROCESSING" || record.status === "RECEIVED"
      ? Clock3
      : record.status === "FAILED"
        ? CircleAlert
        : Box;
  return (
    <tr>
      <th scope="row" className={styles.recordCell}>
        <span className={styles.typeIcon}>
          <Icon aria-hidden="true" size={24} />
        </span>
        <div>
          <span className={styles.target} title={record.defangedTarget}>
            {record.defangedTarget}
          </span>
          <p className={styles.recordMeta}>
            {record.type} · {result?.scamCategory ?? "Rekaman investigasi"}
          </p>
          {!result && (
            <p className={styles.recordMessage} title={getInvestigationMessage(record)}>
              {getInvestigationMessage(record)}
            </p>
          )}
        </div>
      </th>
      <td className={styles.indicatorCell}>
        {result ? (
          <>
            <span
              className={styles.scoreBadge}
              data-level={result.riskLevel}
              aria-label={`${model ? "Skor indikator model" : "Skor"}: ${result.riskScore} dari 100`}
            >
              <FileSearch aria-hidden="true" size={14} />
              {result.riskScore}/100
            </span>
            <span className={styles.indicatorCaption}>
              {model ? "Perlu verifikasi" : getRiskPresentation(result.riskLevel).label}
            </span>
          </>
        ) : (
          <span className={styles.statusBadge} data-status={record.status}>
            <StatusIcon aria-hidden="true" size={15} />
            {getInvestigationLabel(record)}
          </span>
        )}
      </td>
      <td className={styles.dateCell}>
        <time dateTime={record.createdAt}>{formatHistoryDate(record.createdAt)}</time>
      </td>
      <td className={styles.actionCell}>
        <Link
          href={PROTECTED_ROUTES.historyDetail(record.id)}
          aria-label={`Lihat rekaman: ${record.defangedTarget}`}
        >
          Lihat rekaman <ArrowRight aria-hidden="true" size={16} />
        </Link>
      </td>
    </tr>
  );
}
