"use client";
import { INVESTIGATION_STATUS_LABELS } from "@/lib/investigations/presentation";

export function HistoryFilters({
  values,
  onChange,
}: {
  values: { type: string; risk: string; status: string; search: string; from: string; to: string };
  onChange: (key: string, value: string) => void;
}) {
  const field =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800";
  return (
    <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 sm:grid-cols-2 lg:grid-cols-3">
      <label className="space-y-1.5 text-xs font-semibold text-slate-600">
        Jenis input
        <select
          aria-label="Filter jenis input"
          value={values.type}
          onChange={(event) => onChange("type", event.target.value)}
          className={field}
        >
          <option value="ALL">Semua jenis</option>
          <option value="URL">Tautan URL</option>
          <option value="QR">Kode QR</option>
          <option value="APK">Berkas APK</option>
        </select>
      </label>
      <label className="space-y-1.5 text-xs font-semibold text-slate-600">
        Status
        <select
          aria-label="Filter status investigasi"
          value={values.status}
          onChange={(event) => onChange("status", event.target.value)}
          className={field}
        >
          <option value="ALL">Semua status</option>
          {Object.entries(INVESTIGATION_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label className="space-y-1.5 text-xs font-semibold text-slate-600">
        Risiko
        <select
          aria-label="Filter tingkat risiko"
          value={values.risk}
          onChange={(event) => onChange("risk", event.target.value)}
          className={field}
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
      <label className="space-y-1.5 text-xs font-semibold text-slate-600">
        Cari investigasi (Opsional)
        <input
          type="search"
          aria-label="Cari investigasi"
          maxLength={200}
          value={values.search}
          onChange={(event) => onChange("search", event.target.value)}
          placeholder="Cari domain atau nama berkas…"
          className={field}
        />
      </label>
      <label className="space-y-1.5 text-xs font-semibold text-slate-600">
        Dari tanggal (Opsional)
        <input
          type="date"
          aria-label="Dari tanggal"
          value={values.from}
          onChange={(event) => onChange("from", event.target.value)}
          className={field}
        />
      </label>
      <label className="space-y-1.5 text-xs font-semibold text-slate-600">
        Sampai tanggal (Opsional)
        <input
          type="date"
          aria-label="Sampai tanggal"
          min={values.from || undefined}
          value={values.to}
          onChange={(event) => onChange("to", event.target.value)}
          className={field}
        />
      </label>
    </div>
  );
}
