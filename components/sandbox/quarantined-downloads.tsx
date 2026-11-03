"use client";
import Link from "next/link";
import type { z } from "zod";
import { PROTECTED_ROUTES } from "@/lib/routes";
import type { sandboxSessionSchema } from "@/lib/validations/sandbox";
import { useQuarantinedDownloads } from "./use-quarantined-downloads";
export function QuarantinedDownloads({
  session,
}: {
  session: z.infer<typeof sandboxSessionSchema>;
}) {
  const { pending, error, records, analyze } = useQuarantinedDownloads(session);
  return (
    <section
      aria-labelledby="quarantine-title"
      className="space-y-4 rounded-2xl border border-amber-200 bg-white p-5"
    >
      <h2 id="quarantine-title" className="text-lg font-semibold">
        Karantina unduhan APK
      </h2>
      <p className="max-w-2xl text-sm leading-relaxed text-slate-600">
        APK yang selesai diunduh di browser server dipindahkan ke karantina. Berkas tidak dikirim ke
        perangkatmu dan tidak dijalankan. Maksimal 4 APK, masing-masing 50 MB; berkas dihapus saat
        sesi berakhir.
      </p>
      {!session.downloads.length && !Object.keys(records).length && (
        <p className="text-sm text-slate-500">Belum ada APK yang dikarantina pada sesi ini.</p>
      )}
      <ul className="space-y-3">
        {session.downloads.map((file, i) => (
          <li
            key={file.id}
            data-testid="quarantined-download"
            className="space-y-2 rounded-xl border border-slate-200 p-4"
          >
            <p className="text-sm font-semibold">
              Unduhan APK {i + 1} · {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <p className="text-xs break-all text-slate-500">SHA-256: {file.sha256}</p>
            {!records[file.id] && (
              <button
                type="button"
                onClick={() => void analyze(file.id)}
                disabled={Boolean(pending) || session.status !== "ACTIVE"}
                className="bg-brand-600 min-h-11 rounded-xl px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {pending === file.id ? "Membedah APK..." : "Bedah APK statis"}
              </button>
            )}
          </li>
        ))}
      </ul>
      {Object.entries(records).map(([downloadId, recordId]) => (
        <Link
          key={downloadId}
          href={PROTECTED_ROUTES.historyDetail(recordId)}
          className="text-brand-700 block min-h-11 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold"
        >
          Lihat hasil bedah APK ({downloadId.slice(0, 8)})
        </Link>
      ))}
      {error && (
        <p role="alert" className="text-sm text-rose-700">
          {error}
        </p>
      )}
    </section>
  );
}
