"use client";

import { ArrowUpRight, Code2, FileText, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import shared from "./landing.module.css";
import { LandingLink } from "./landing-link";
import { ResultPreviewReport } from "./result-preview-report";
import styles from "./result-preview.module.css";

const highlights = [
  {
    icon: FileText,
    title: "Ringkasan yang mudah dipahami",
    description: "Baca arti indikator dan hal yang masih perlu kamu verifikasi.",
  },
  {
    icon: Code2,
    title: "Detail saat kamu membutuhkannya",
    description: "Lihat sumber analisis, versi model, dan bukti yang tersedia.",
  },
  {
    icon: Share2,
    title: "Hasil lengkap bisa dibagikan",
    description: "Buat Guardian Share Card untuk membantu keluarga dan teman lebih waspada.",
  },
];

/** Presentation only: never passed to investigation, export, or community services. */
export function ResultPreviewSection() {
  return (
    <section
      aria-labelledby="result-preview-title"
      className={cn(shared.sectionSpacing, styles.section)}
    >
      <div className={cn(shared.container, shared.sectionContainer)}>
        <h2
          id="result-preview-title"
          className={cn(shared.display, shared.sectionTitle)}
          data-landing-reveal
        >
          Seperti ini hasil pemeriksaannya.
        </h2>
        <p className={shared.sectionIntro} data-landing-reveal data-landing-order="1">
          Kenali bentuk ringkasan dan detailnya sebelum mulai. Pratinjau ini bisa kamu jelajahi
          tanpa masuk.
        </p>
        <div className={styles.showcase} data-landing-reveal data-landing-order="1">
          <ResultPreviewReport />
          <div className={styles.explanation}>
            <h3 className={cn(shared.display, styles.explanationTitle)}>
              Satu hasil, dua cara membaca.
            </h3>
            <ul className={styles.highlights}>
              {highlights.map(({ icon: Icon, title, description }) => (
                <li key={title}>
                  <span className={styles.highlightIcon}>
                    <Icon aria-hidden="true" />
                  </span>
                  <div>
                    <h4>{title}</h4>
                    <p>{description}</p>
                  </div>
                </li>
              ))}
            </ul>
            <LandingLink className={shared.primary}>
              Periksa tautanmu <ArrowUpRight aria-hidden="true" />
            </LandingLink>
          </div>
        </div>
      </div>
    </section>
  );
}
