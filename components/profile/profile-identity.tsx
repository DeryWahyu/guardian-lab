import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CalendarDays,
  FileSearch,
  Flame,
  ShieldCheck,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { calculateRank } from "@/lib/academy/gamification";
import { PROTECTED_ROUTES } from "@/lib/routes";
import type { Profile } from "@/lib/validations/profile";
import { ProfileIllustration } from "./profile-illustration";
import { profileDate, profileInitials } from "./profile-presentation";
import styles from "./profile.module.css";

export function ProfileIdentity({ profile }: { profile: Profile }) {
  const rank = calculateRank(profile.progress.exp);
  const highest = rank.rank === "Forensic Master";
  return (
    <>
      <section className={styles.identity} aria-labelledby="profile-name" data-user-reveal>
        <div className={styles.identityCopy}>
          <div className={styles.avatar} aria-hidden="true">
            {profileInitials(profile.name)}
          </div>
          <div className={styles.identityText}>
            <span className={styles.eyebrow}>AKUN GUARDIAN</span>
            <h2 id="profile-name">{profile.name}</h2>
            <p className={styles.email}>{profile.email}</p>
            <div className={styles.identityMeta}>
              <span className={styles.verified}>
                <BadgeCheck size={15} aria-hidden="true" />
                {profile.verified ? "WhatsApp terverifikasi" : "Belum terverifikasi"}
              </span>
              <span className={styles.joined}>
                <CalendarDays size={19} aria-hidden="true" />
                Bergabung {profileDate(profile.createdAt)}
              </span>
            </div>
          </div>
        </div>
        <div className={styles.rank}>
          <div className={styles.rankHeading}>
            <span>
              <Trophy size={18} aria-hidden="true" />
              Peringkatmu
            </span>
          </div>
          <div className={styles.rankValue}>
            <h3>{rank.rank}</h3>
            <strong>
              {profile.progress.exp.toLocaleString("id-ID")} <small>EXP</small>
            </strong>
          </div>
          <progress
            value={rank.progressPercent}
            max={100}
            aria-label={
              highest ? "Peringkat tertinggi tercapai" : "Progres menuju peringkat berikutnya"
            }
          />
          <p>
            {highest
              ? "Peringkat tertinggi tercapai. Terus bagikan kewaspadaanmu."
              : `${(rank.nextRankExp - profile.progress.exp).toLocaleString("id-ID")} EXP lagi ke peringkat berikutnya.`}
          </p>
          <Link href={PROTECTED_ROUTES.academy}>
            Lanjutkan belajar <ArrowRight size={19} aria-hidden="true" />
          </Link>
        </div>
        <ProfileIllustration />
      </section>
      <dl
        className={styles.statistics}
        aria-label="Aktivitas akunmu"
        data-user-reveal
        data-user-order="1"
      >
        {[
          { label: "Pemeriksaan", value: profile.investigations, Icon: FileSearch },
          { label: "Latihan lulus", value: profile.progress.completed, Icon: BookOpen },
          { label: "Kasus diselesaikan", value: profile.progress.casesSolved, Icon: ShieldCheck },
          { label: "Hari berturut-turut", value: profile.progress.streakDays, Icon: Flame },
        ].map(({ label, value, Icon }) => (
          <div key={label}>
            <dt>
              <span>
                <Icon size={27} aria-hidden="true" />
              </span>
              {label}
            </dt>
            <dd>{value.toLocaleString("id-ID")}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}
