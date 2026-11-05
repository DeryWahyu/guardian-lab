"use client";

import { Check, Copy, Download, Share2 } from "lucide-react";
import type { RefObject } from "react";
import workspace from "@/components/workspace/workspace.module.css";
import type { ShareCardData } from "@/lib/share-card/content";
import { useShareCardActions } from "./use-share-card-actions";

const button = workspace.secondary;

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
    <section aria-label="Unduh dan bagikan kartu" className="w-full space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={actions.download}
          disabled={actions.status !== "ready" || busy}
          className={workspace.primary}
        >
          <Download className="size-4" aria-hidden="true" />
          {actions.status === "preparing" ? "Menyiapkan PNG…" : "Unduh PNG"}
        </button>
        <button type="button" onClick={actions.copy} disabled={busy} className={button}>
          {actions.copied ? (
            <Check className="size-4" aria-hidden="true" />
          ) : (
            <Copy className="size-4" aria-hidden="true" />
          )}
          {actions.operation === "copy"
            ? "Menyalin pesan…"
            : actions.copied
              ? "Salin ulang pesan"
              : "Salin pesan WhatsApp"}
        </button>
      </div>
      {actions.canShare && (
        <button
          type="button"
          onClick={actions.share}
          disabled={actions.status !== "ready" || busy}
          className={button}
        >
          <Share2 className="size-4" aria-hidden="true" />
          {actions.operation === "share" ? "Membuka pilihan berbagi…" : "Bagikan gambar"}
        </button>
      )}
      <div aria-live="polite" className="text-sm text-slate-600">
        {actions.status === "preparing" && <p>Menyiapkan gambar untuk diunduh atau dibagikan…</p>}
        {actions.status === "error" && (
          <div className="space-y-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-900">
            <p>Gambar belum berhasil disiapkan. Pesan teks tetap dapat disalin.</p>
            <button type="button" onClick={actions.retry} className={button}>
              Coba siapkan gambar
            </button>
          </div>
        )}
        {actions.status === "ready" && !actions.feedback && (
          <p>
            PNG siap.{" "}
            {actions.canShare
              ? "Pilih aplikasi tujuan melalui Bagikan gambar."
              : "Unduh gambar, lalu lampirkan di WhatsApp atau aplikasi pesan."}
          </p>
        )}
        {actions.feedback && <p>{actions.feedback}</p>}
      </div>
      {actions.manualCopy && (
        <div className="space-y-2">
          <label htmlFor="share-message" className="text-sm font-semibold text-slate-700">
            Pesan untuk disalin manual
          </label>
          <textarea
            id="share-message"
            readOnly
            value={card.text}
            onFocus={(event) => event.currentTarget.select()}
            className="focus-visible:outline-brand-600 min-h-56 w-full rounded-xl border border-slate-300 bg-white p-3 text-sm focus-visible:outline-2"
          />
        </div>
      )}
    </section>
  );
}
