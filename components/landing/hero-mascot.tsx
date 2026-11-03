import Image from "next/image";
import guardianFox from "@/public/brand/guardian-lab-fox.webp";
import styles from "./hero.module.css";

export function HeroMascot() {
  return (
    <div className={styles.visual}>
      <Image
        src={guardianFox}
        alt="Maskot rubah Guardian berjaket logo Koneksi dan membawa kaca pembesar."
        sizes="(min-width: 1024px) 280px, (min-width: 768px) 220px, (min-width: 640px) 120px, 88px"
        loading="eager"
        fetchPriority="high"
        className={styles.fox}
      />
    </div>
  );
}
