import Link from "next/link";
import type { z } from "zod";
import { learningControl } from "@/components/academy/learning-ui";
import { PROTECTED_ROUTES } from "@/lib/routes";
import type { sandboxSessionSchema } from "@/lib/validations/sandbox";

const labels = {
  STARTING: "Menyiapkan",
  ACTIVE: "Aktif",
  EXPIRED: "Waktu habis",
  DESTROYED: "Dihapus",
  FAILED: "Gagal",
  UNKNOWN: "Belum terkonfirmasi",
};
export function SandboxSessionPanel({
  session,
  remaining,
  pending,
  onStop,
}: {
  session: z.infer<typeof sandboxSessionSchema>;
  remaining: number;
  pending: boolean;
  onStop: () => void;
}) {
  const live = ["STARTING", "ACTIVE", "UNKNOWN"].includes(session.status);
  return (
    <section
      aria-label="Sesi sandbox"
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
    >
      <div className="space-y-3 border-b border-slate-200 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm">
            Status: <strong>{labels[session.status]}</strong>
            {live && (
              <>
                {" "}
                / Sisa <span className="font-semibold tabular-nums">{remaining} detik</span>
              </>
            )}
          </p>
          {live && (
            <button type="button" disabled={pending} className={learningControl} onClick={onStop}>
              Hentikan dan hapus sesi
            </button>
          )}
        </div>
        <p className="text-xs text-slate-500">Tautan awal sesi ini</p>
        <p className="text-sm font-medium break-all" data-testid="sandbox-active-target">
          {session.targetUrl}
        </p>
        {session.sourceInvestigationId && (
          <Link
            href={PROTECTED_ROUTES.historyDetail(session.sourceInvestigationId)}
            className="text-brand-700 inline-flex min-h-11 items-center text-sm underline"
          >
            Kembali ke investigasi sumber
          </Link>
        )}
      </div>
      {session.status === "ACTIVE" && session.streamUrl && remaining > 0 ? (
        <iframe
          title="Browser Chromium terisolasi"
          src={session.streamUrl}
          className="aspect-video min-h-64 w-full bg-slate-950 sm:min-h-96"
          sandbox="allow-scripts allow-same-origin"
          allow="clipboard-read 'none'; clipboard-write 'none'; camera 'none'; microphone 'none'; geolocation 'none'"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="flex min-h-64 items-center justify-center p-6 text-center text-sm text-slate-600">
          {session.status === "STARTING"
            ? "Container sedang disiapkan. Status diperbarui otomatis."
            : session.status === "UNKNOWN"
              ? "Koneksi runtime terputus. Pembersihan belum terkonfirmasi; periksa status kembali."
              : live
                ? "Waktu sesi selesai. Menunggu konfirmasi penghapusan container."
                : "Sesi sudah berakhir. Mulai sesi baru untuk membuka browser."}
        </div>
      )}
    </section>
  );
}
