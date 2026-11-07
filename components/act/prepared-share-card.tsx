"use client";

import { FileCheck2, ImageIcon, Info } from "lucide-react";
import Link from "next/link";
import { memo, useRef } from "react";
import { PROTECTED_ROUTES } from "@/lib/routes";
import type { ShareCardData } from "@/lib/share-card/content";
import { ShareCardActions } from "./share-card-actions";
import { ShareCardCanvas } from "./share-card-canvas";
import styles from "./share-workspace.module.css";

export const PreparedShareCard = memo(
  function PreparedShareCard({ card }: { card: ShareCardData }) {
    const cardRef = useRef<HTMLDivElement | null>(null);
    return (
      <div className={styles.preparedLayout} data-motion-skip>
        <section className={styles.previewPanel} aria-labelledby="share-preview-title">
          <div className={styles.previewHeading}>
            <h2 id="share-preview-title">
              <ImageIcon aria-hidden="true" size={17} />
              Pratinjau kartu
            </h2>
            <span>Format PNG</span>
          </div>
          <ShareCardCanvas card={card} />
        </section>
        <aside className={styles.actionPanel} aria-labelledby="share-actions-title">
          <h2 id="share-actions-title">Siap mengingatkan orang terdekat?</h2>
          <p className={styles.panelDescription}>
            Periksa isi kartu, lalu pilih cara membagikannya.
          </p>
          <div className={styles.selectedSource}>
            <p>Hasil yang dipilih</p>
            <div>
              <span>
                <FileCheck2 aria-hidden="true" size={16} />
                {card.type}
              </span>
              <Link href={PROTECTED_ROUTES.history}>Ganti hasil</Link>
            </div>
            <p className={styles.selectedTarget}>{card.target}</p>
            <span>{card.date}</span>
          </div>
          <ShareCardActions cardRef={cardRef} card={card} />
          <p className={styles.privacyNote}>
            <Info aria-hidden="true" size={17} /> Kamu memilih aplikasi dan penerima. Periksa
            kembali isi kartu sebelum meneruskannya.
          </p>
        </aside>
        <div
          aria-hidden="true"
          className="pointer-events-none fixed top-0 -left-[10000px] w-[600px]"
        >
          <ShareCardCanvas card={card} cardRef={cardRef} />
        </div>
      </div>
    );
  },
  (previous, next) => previous.card.text === next.card.text,
);
