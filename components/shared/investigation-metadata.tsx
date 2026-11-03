import Link from "next/link";
import { PROTECTED_ROUTES } from "@/lib/routes";
import type { Investigation } from "@/lib/validations/investigation";

export function InvestigationMetadata({ record }: { record: Investigation }) {
  const date = (value: string | null) =>
    value ? new Date(value).toLocaleString("id-ID") : "Belum tercatat";
  const fields = [
    ["ID investigasi", record.id],
    ["Jenis input", record.type],
    ["Diterima", date(record.createdAt)],
    ["Terakhir diperbarui", date(record.updatedAt)],
    ["Mulai diproses", date(record.startedAt)],
    ["Waktu status akhir", record.finishedAt ? date(record.finishedAt) : "Belum berakhir"],
    ["Sumber analisis", record.analysisSource ?? "Belum tersedia"],
    ["Versi model", record.modelVersion ?? "Belum tersedia"],
  ];
  return (
    <dl className="grid gap-4 text-sm sm:grid-cols-2">
      {fields.map(([label, value]) => (
        <div key={label}>
          <dt className="text-slate-500">{label}</dt>
          <dd className="mt-0.5 break-all text-slate-800">{value}</dd>
        </div>
      ))}
      {typeof record.inputMetadata.sourceInvestigationId === "string" && (
        <div>
          <dt className="text-slate-500">Sumber unduhan sandbox</dt>
          <dd>
            <Link
              className="text-brand-700 inline-flex min-h-11 items-center underline"
              href={PROTECTED_ROUTES.historyDetail(record.inputMetadata.sourceInvestigationId)}
            >
              Kembali ke investigasi URL/QR
            </Link>
          </dd>
        </div>
      )}
    </dl>
  );
}
