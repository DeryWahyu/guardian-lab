import { BookOpenCheck, Flame, ShieldCheck, Sparkles, Trophy } from "lucide-react";
import type { AcademyProgress } from "./academy-presentation";
import styles from "./academy-hero.module.css";

export function AcademyStats({ progress }: { progress: AcademyProgress }) {
  const metrics = [
    { label: "Peringkatmu", value: progress.rank, Icon: Trophy },
    { label: "Total EXP", value: progress.exp.toLocaleString("id-ID"), Icon: Sparkles },
    { label: "Hari berturut-turut", value: progress.streakDays, Icon: Flame },
    { label: "Kuis lulus", value: progress.completed, Icon: BookOpenCheck },
    { label: "Kasus diselesaikan", value: progress.casesSolved, Icon: ShieldCheck },
  ];
  return (
    <dl
      className={styles.metrics}
      aria-label="Progres belajar akun"
      data-user-reveal
      data-user-order="1"
    >
      {metrics.map(({ label, value, Icon }) => (
        <div key={label}>
          <dt>
            <span>
              <Icon aria-hidden="true" size={20} />
            </span>
            {label}
          </dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}
