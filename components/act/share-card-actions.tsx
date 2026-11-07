"use client";

import {
  Check,
  ChevronDown,
  Copy,
  Download,
  Loader2,
  MessageCircle,
  RefreshCw,
  Share2,
} from "lucide-react";
import type { RefObject } from "react";
import type { ShareCardData } from "@/lib/share-card/content";
import { useShareCardActions } from "./use-share-card-actions";
import styles from "./share-workspace.module.css";

export function ShareCardActions({
  cardRef,
  card,
}: {
  cardRef: RefObject<HTMLDivElement | null>;
  card: ShareCardData;
}) {
  const actions = useShareCardActions(cardRef, card);
  const busy = actions.operation !== null;
  return (
    <section aria-label="Unduh dan bagikan kartu" className={styles.shareActions}>
      <div className={styles.actionButtons}>
        <button
          type="button"
          onClick={actions.download}
          disabled={actions.status !== "ready" || busy}
          className={styles.primaryButton}
        >
          {actions.status === "preparing" ? (
            <Loader2
              aria-hidden="true"
              size={18}
              className="animate-spin motion-reduce:animate-none"
            />
          ) : (
            <Download aria-hidden="true" size={18} />
          )}
          {actions.status === "preparing" ? "Menyiapkan PNG..." : "Unduh PNG"}
        </button>
        <button
          type="button"
          onClick={actions.copy}
          disabled={busy}
          className={styles.secondaryButton}
        >
          {actions.copied ? (
            <Check aria-hidden="true" size={18} />
          ) : (
            <Copy aria-hidden="true" size={18} />
          )}
          {actions.operation === "copy"
            ? "Menyalin pesan..."
            : actions.copied
              ? "Salin ulang pesan"
              : "Salin pesan WhatsApp"}
        </button>
        {actions.canShare && (
          <button
            type="button"
            onClick={actions.share}
            disabled={actions.status !== "ready" || busy}
            className={styles.secondaryButton}
          >
            <Share2 aria-hidden="true" size={18} />
            {actions.operation === "share" ? "Membuka pilihan berbagi..." : "Bagikan gambar"}
          </button>
        )}
      </div>
      {!actions.manualCopy && (
        <details className={styles.messageDetails}>
          <summary>
            <MessageCircle aria-hidden="true" size={17} />
            <span>Pratinjau pesan WhatsApp</span>
            <ChevronDown aria-hidden="true" size={16} />
          </summary>
          <textarea
            aria-label="Pratinjau pesan WhatsApp"
            className={styles.messagePreview}
            readOnly
            spellCheck={false}
            value={card.text}
          />
        </details>
      )}
      <div aria-live="polite" className={styles.exportFeedback} data-status={actions.status}>
        {actions.status === "preparing" && <p>Menyiapkan gambar untuk diunduh atau dibagikan...</p>}
        {actions.status === "error" && (
          <div className={styles.exportError}>
            <p>Gambar belum berhasil disiapkan. Pesan teks tetap dapat disalin.</p>
            <button type="button" onClick={actions.retry} className={styles.secondaryButton}>
              <RefreshCw aria-hidden="true" size={16} />
              Coba siapkan gambar
            </button>
          </div>
        )}
        {actions.status === "ready" && !actions.feedback && (
          <p className={styles.readyMessage}>
            <Check aria-hidden="true" size={16} />
            <span>
              PNG siap.{" "}
              {actions.canShare
                ? "Pilih aplikasi tujuan melalui Bagikan gambar."
                : "Unduh gambar, lalu lampirkan di WhatsApp atau aplikasi pesan."}
            </span>
          </p>
        )}
        {actions.feedback && <p>{actions.feedback}</p>}
      </div>
      {actions.manualCopy && (
        <div className={styles.manualCopy}>
          <label htmlFor="share-message">Pesan untuk disalin manual</label>
          <textarea
            id="share-message"
            readOnly
            value={card.text}
            onFocus={(event) => event.currentTarget.select()}
          />
        </div>
      )}
    </section>
  );
}
