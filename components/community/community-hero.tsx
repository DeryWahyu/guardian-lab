import { ArrowRight, FilePlus2, Trophy } from "lucide-react";
import Link from "next/link";
import { PROTECTED_ROUTES } from "@/lib/routes";
import { CommunityIllustration } from "./community-illustration";
import styles from "./community.module.css";

export function CommunityHero() {
  return (
    <section className={styles.hero} aria-labelledby="community-title" data-user-reveal>
      <div className={styles.heroCopy}>
        <h1 id="community-title">
          Belajar dari kasus,
          <span>saling menjaga.</span>
        </h1>
        <p>
          Telusuri bukti dari kasus yang ditinjau. Ajukan hasil pemeriksaan untuk membantu Guardian
          lain.
        </p>
        <div className={styles.heroActions}>
          <Link href={PROTECTED_ROUTES.history} className={styles.primaryButton}>
            <FilePlus2 aria-hidden="true" size={23} />
            Ajukan dari riwayat
            <ArrowRight aria-hidden="true" size={21} />
          </Link>
          <Link href={PROTECTED_ROUTES.leaderboard} className={styles.secondaryButton}>
            <Trophy aria-hidden="true" size={23} />
            Peringkat Guardian
          </Link>
        </div>
      </div>
      <CommunityIllustration />
    </section>
  );
}
