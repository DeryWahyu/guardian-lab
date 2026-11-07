import { Box, Layers3, ShieldAlert } from "lucide-react";
import type { HistoryResponse } from "@/lib/validations/history";
import styles from "./history-workspace.module.css";

export function HistoryStatistics({
  summary,
  loading,
}: {
  summary: HistoryResponse["summary"] | null;
  loading: boolean;
}) {
  const statistics = [
    { label: "Investigasi sesuai filter", value: summary?.total, Icon: Layers3 },
    { label: "Hasil berisiko tinggi", value: summary?.highRisk, Icon: ShieldAlert },
    { label: "Model belum tersedia", value: summary?.unavailable, Icon: Box },
  ];
  return (
    <dl
      className={styles.statistics}
      aria-label="Ringkasan riwayat sesuai filter"
      data-user-reveal
      data-user-order="1"
    >
      {statistics.map(({ label, value, Icon }) => (
        <div key={label}>
          <dt>
            <span>
              <Icon aria-hidden="true" size={27} />
            </span>
            {label}
          </dt>
          <dd>
            {value === undefined ? (
              <small>{loading ? "Memuat..." : "Belum tersedia"}</small>
            ) : (
              value
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
