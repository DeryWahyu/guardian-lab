import {
  ArrowUpRight,
  CircleAlert,
  Clock3,
  Link2,
  LockKeyhole,
  Monitor,
  RefreshCw,
  ShieldCheck,
  Square,
} from "lucide-react";
import Link from "next/link";
import type { z } from "zod";
import { PROTECTED_ROUTES } from "@/lib/routes";
import type { sandboxSessionSchema } from "@/lib/validations/sandbox";
import styles from "./sandbox-session.module.css";
import shared from "./web-sandbox.module.css";

const labels = {
  STARTING: "Menyiapkan",
  ACTIVE: "Aktif",
  EXPIRED: "Waktu habis",
  DESTROYED: "Dihapus",
  FAILED: "Gagal",
  UNKNOWN: "Belum terkonfirmasi",
};

const messages = {
  STARTING: {
    title: "Menyiapkan ruang jelajah...",
    description: "Browser terisolasi sedang disiapkan. Status diperbarui otomatis.",
  },
  UNKNOWN: {
    title: "Status sesi perlu diperiksa.",
    description:
      "Koneksi runtime terputus. Pembersihan belum terkonfirmasi; periksa status kembali.",
  },
  FAILED: {
    title: "Browser belum berhasil dibuka.",
    description: "Mulai sesi baru melalui form tautan. Jika masih gagal, periksa status layanan.",
  },
  DESTROYED: {
    title: "Sesi dan data sementara telah dihapus.",
    description: "Mulai sesi baru melalui form tautan untuk melanjutkan penjelajahan.",
  },
  EXPIRED: {
    title: "Sesi jelajah telah berakhir.",
    description: "Mulai sesi baru melalui form tautan untuk melanjutkan penjelajahan.",
  },
};

export function SandboxSessionPanel({
  session,
  remaining,
  pending,
  onStop,
  onRefresh,
}: {
  session: z.infer<typeof sandboxSessionSchema>;
  remaining: number;
  pending: boolean;
  onStop: () => void;
  onRefresh: () => void;
}) {
  const live = ["STARTING", "ACTIVE", "UNKNOWN"].includes(session.status);
  const seconds = Math.max(0, Math.min(180, remaining));
  const time = `${Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
  const unknown = session.status === "UNKNOWN";
  const failed = session.status === "FAILED";
  const deleted = session.status === "DESTROYED";
  const StateIcon = unknown || failed ? CircleAlert : deleted ? ShieldCheck : Monitor;
  const message =
    session.status === "ACTIVE"
      ? seconds > 0
        ? {
            title: "Menunggu tampilan browser.",
            description: "Stream belum tersedia. Periksa status kembali untuk melihat pembaruan.",
          }
        : {
            title: "Sesi jelajah telah berakhir.",
            description: "Waktu sesi selesai. Menunggu konfirmasi penghapusan container.",
          }
      : messages[session.status];

  return (
    <section aria-label="Sesi sandbox" className={styles.session}>
      <div className={styles.toolbar}>
        <div className={styles.sessionIdentity}>
          <span className={shared.headingIcon}>
            <Monitor aria-hidden="true" size={21} />
          </span>
          <div>
            <h2>Browser terisolasi</h2>
            <span className={styles.status} data-status={session.status}>
              {labels[session.status]}
            </span>
          </div>
        </div>
        {live && (
          <div className={styles.sessionControls}>
            <div
              className={styles.timer}
              data-urgent={seconds <= 30}
              role="timer"
              aria-label={`Sisa waktu ${seconds} detik`}
            >
              <Clock3 aria-hidden="true" size={19} />
              <div>
                <span>Sisa waktu</span>
                <strong>{time}</strong>
              </div>
            </div>
            <button
              type="button"
              disabled={pending}
              className={shared.secondaryButton}
              onClick={onRefresh}
            >
              <RefreshCw aria-hidden="true" size={16} /> Periksa status
            </button>
            <button type="button" disabled={pending} className={styles.stopButton} onClick={onStop}>
              <Square aria-hidden="true" size={14} /> Hentikan dan hapus sesi
            </button>
          </div>
        )}
      </div>
      {live && (
        <progress
          aria-label="Sisa waktu sesi sandbox"
          max={180}
          value={seconds}
          className={styles.progress}
        />
      )}
      <div className={styles.addressBar}>
        <Link2 aria-hidden="true" className={styles.addressIcon} size={18} />
        <div>
          <span>Tautan awal sesi ini</span>
          <p data-testid="sandbox-active-target">{session.targetUrl}</p>
        </div>
        {session.sourceInvestigationId && (
          <Link
            href={PROTECTED_ROUTES.historyDetail(session.sourceInvestigationId)}
            className={styles.sourceLink}
          >
            Investigasi sumber <ArrowUpRight aria-hidden="true" size={16} />
          </Link>
        )}
      </div>
      {session.status === "ACTIVE" && session.streamUrl && remaining > 0 ? (
        <iframe
          title="Browser Chromium terisolasi"
          src={session.streamUrl}
          className={styles.browser}
          sandbox="allow-scripts allow-same-origin"
          allow="clipboard-read 'none'; clipboard-write 'none'; camera 'none'; microphone 'none'; geolocation 'none'"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className={styles.sessionState} role="status">
          <span className={styles.stateIcon}>
            <StateIcon aria-hidden="true" size={29} />
          </span>
          <h3>{message.title}</h3>
          <p>{message.description}</p>
        </div>
      )}
      {live && (
        <p className={styles.browserFootnote}>
          <LockKeyhole aria-hidden="true" size={15} /> Jangan masukkan akun atau data pribadi.
          Clipboard dan unduhan langsung ke perangkat dinonaktifkan.
        </p>
      )}
    </section>
  );
}
