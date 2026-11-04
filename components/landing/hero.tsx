import type { ReactNode } from "react";
import { LANDING_SECTIONS } from "@/lib/routes";
import { cn } from "@/lib/utils";
import styles from "./hero.module.css";
import shared from "./landing.module.css";

export function HeroSection({ children }: { children: ReactNode }) {
  return (
    <section
      id={LANDING_SECTIONS.home}
      tabIndex={-1}
      aria-labelledby="landing-title"
      data-hero-stage
      className={styles.hero}
    >
      <div className={cn(shared.container, styles.stage)}>
        <div className={styles.composition}>
          <div className={styles.intro}>
            <h1 id="landing-title" className={cn(shared.display, styles.title)}>
              Sebelum klik,
              <br />
              cek dulu.
            </h1>
            <p>Periksa tautan yang bikin ragu. Baca kode QR tanpa membuka situsnya di perangkatmu.</p>
          </div>
          <section
            id="periksa"
            tabIndex={-1}
            aria-label="Meja pemeriksaan"
            className={styles.formSlot}
          >
            {children}
          </section>
        </div>
      </div>
    </section>
  );
}
