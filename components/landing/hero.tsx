import type { ReactNode } from "react";
import styles from "./hero.module.css";
import { HeroMascot } from "./hero-mascot";

export function HeroSection({ children }: { children: ReactNode }) {
  return (
    <section aria-labelledby="gateway-title" className={styles.hero}>
      <div className={styles.stage}>
        <div className={styles.scene}>
          <div className={styles.intro}>
            <h1 id="gateway-title" className={styles.title}>
              <span className={styles.titleLine}>Sebelum klik,</span>
              <span className={`${styles.titleLine} ${styles.accent}`}>cek dulu.</span>
            </h1>
            <p className={styles.description}>
              Tautan, kode QR, atau APK yang meragukan? Mulai pemeriksaan di sini.
            </p>
          </div>
          <HeroMascot />
          <div className={styles.formSlot}>{children}</div>
        </div>
      </div>
    </section>
  );
}
