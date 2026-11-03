"use client";
import type { ThreatAnalysisResult } from "@/types/analysis";

export function GeekViewPanel({
  result,
  search = "",
  onSearchChange,
}: {
  result: ThreatAnalysisResult;
  search?: string;
  onSearchChange?: (value: string) => void;
}) {
  const entries = Object.entries(result.technicalEvidence);
  const filtered = entries.filter(([key, value]) =>
    `${key} ${JSON.stringify(value)}`.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <section
      aria-label="Bukti teknis tersimpan"
      className="space-y-4 rounded-2xl bg-slate-950 p-5 text-slate-100"
    >
      <h3 className="font-mono text-base font-semibold">Bukti teknis tersimpan</h3>
      <p className="font-mono text-xs break-all text-slate-300">{result.defangedTarget}</p>
      <p className="text-xs text-slate-300">
        {result.riskLevel} · {result.riskScore}/100 · {result.scamCategory}
      </p>
      <label className="block text-xs text-slate-400" htmlFor="evidence-search">
        Cari bukti (Opsional)
      </label>
      <input
        id="evidence-search"
        type="search"
        value={search}
        maxLength={200}
        onChange={(event) => onSearchChange?.(event.target.value)}
        placeholder="Cari permission, endpoint, atau nama atribut…"
        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
      />
      <p className="text-xs text-slate-400">
        {filtered.length} dari {entries.length} atribut. Atribut yang tidak tercatat tidak digunakan
        untuk menyimpulkan kondisi aman.
      </p>
      {!entries.length ? (
        <p className="text-sm text-slate-300">
          Belum ada bukti teknis yang tersimpan pada hasil ini.
        </p>
      ) : !filtered.length ? (
        <p className="text-sm text-slate-300">Tidak ada bukti yang cocok dengan pencarian.</p>
      ) : (
        <div className="max-h-[32rem] space-y-3 overflow-auto">
          {filtered.map(([key, value]) => (
            <div key={key} className="rounded-xl border border-slate-800 p-3">
              <h4 className="text-brand-300 mb-2 font-mono text-xs font-semibold">{key}</h4>
              <pre className="max-h-64 overflow-auto font-mono text-xs break-all whitespace-pre-wrap text-slate-200">
                {JSON.stringify(value, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
