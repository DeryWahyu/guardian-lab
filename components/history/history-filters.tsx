"use client";
import { Search, SlidersHorizontal } from "lucide-react";
import workspace from "@/components/workspace/workspace.module.css";
import { INVESTIGATION_STATUS_LABELS } from "@/lib/investigations/presentation";

type Values = {
  type: string;
  risk: string;
  status: string;
  search: string;
  from: string;
  to: string;
};
export function HistoryFilters({
  values,
  onChange,
}: {
  values: Values;
  onChange: (key: string, value: string) => void;
}) {
  const advanced = [
    values.status !== "ALL",
    values.risk !== "ALL",
    Boolean(values.from),
    Boolean(values.to),
  ].filter(Boolean).length;
  return (
    <div className="space-y-4">
      <label className={workspace.searchBox}>
        <Search aria-hidden="true" className="size-4 shrink-0" />
        <span className="sr-only">Cari investigasi (Opsional)</span>
        <input
          type="search"
          aria-label="Cari investigasi"
          maxLength={200}
          value={values.search}
          onChange={(event) => onChange("search", event.target.value)}
          placeholder="Cari domain atau nama berkas…"
        />
      </label>
      <div className={workspace.filterChips} role="group" aria-label="Filter jenis input">
        {[
          ["ALL", "Semua"],
          ["URL", "Tautan URL"],
          ["QR", "Kode QR"],
          ["APK", "Berkas APK"],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={values.type === value}
            onClick={() => onChange("type", value)}
          >
            {label}
          </button>
        ))}
      </div>
      <details className={workspace.advancedFilters}>
        <summary>
          <SlidersHorizontal aria-hidden="true" className="size-4" /> Filter lanjutan{" "}
          {advanced > 0 && <span>{advanced} aktif</span>}
        </summary>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="text-xs font-semibold">
            Status
            <select
              aria-label="Filter status investigasi"
              value={values.status}
              onChange={(event) => onChange("status", event.target.value)}
              className={workspace.field}
            >
              <option value="ALL">Semua status</option>
              {Object.entries(INVESTIGATION_STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs font-semibold">
            Risiko
            <select
              aria-label="Filter tingkat risiko"
              value={values.risk}
              onChange={(event) => onChange("risk", event.target.value)}
              className={workspace.field}
            >
              <option value="ALL">Semua risiko</option>
              {[
                "SAFE",
                "LOW",
                "MEDIUM",
                "WARNING",
                "HIGH",
                "DANGEROUS",
                "PHISHING",
                "MALWARE",
                "CRITICAL",
              ].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs font-semibold">
            Dari tanggal (Opsional)
            <input
              type="date"
              aria-label="Dari tanggal"
              value={values.from}
              onChange={(event) => onChange("from", event.target.value)}
              className={workspace.field}
            />
          </label>
          <label className="text-xs font-semibold">
            Sampai tanggal (Opsional)
            <input
              type="date"
              aria-label="Sampai tanggal"
              min={values.from || undefined}
              value={values.to}
              onChange={(event) => onChange("to", event.target.value)}
              className={workspace.field}
            />
          </label>
        </div>
      </details>
      {advanced > 0 && (
        <p className="text-xs leading-relaxed text-slate-600">
          Filter aktif:{" "}
          {[
            values.status !== "ALL"
              ? INVESTIGATION_STATUS_LABELS[
                  values.status as keyof typeof INVESTIGATION_STATUS_LABELS
                ]
              : "",
            values.risk !== "ALL" ? values.risk : "",
            values.from ? "dari " + values.from : "",
            values.to ? "sampai " + values.to : "",
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
      )}
    </div>
  );
}
