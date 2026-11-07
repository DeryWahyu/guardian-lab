import { ArrowUpRight, CheckCheck, RotateCcw } from "lucide-react";
import Link from "next/link";
import { PROTECTED_ROUTES } from "@/lib/routes";
import type { AcademyResult } from "./academy-presentation";
import styles from "./quiz-lesson.module.css";

export function QuizOutcome({ result }: { result: AcademyResult }) {
  return (
    <section
      aria-live="polite"
      className={styles.outcome}
      data-passed={result.passed}
      data-user-reveal
    >
      <div className={styles.outcomeSummary}>
        <span className={styles.outcomeIcon}>
          {result.passed ? (
            <CheckCheck aria-hidden="true" size={26} />
          ) : (
            <RotateCcw aria-hidden="true" size={24} />
          )}
        </span>
        <div>
          <p>{result.passed ? "Lulus" : "Belum lulus"}</p>
          <h2>
            {result.passed
              ? "Bekal baru untuk langkah berikutnya."
              : "Pelajari pembahasannya, lalu coba lagi."}
          </h2>
          <p>
            {result.correctCount} dari {result.totalQuestions} soal benar. +{result.expEarned} EXP.
          </p>
        </div>
        <div className={styles.score}>
          <span>Nilai</span>
          <strong>
            {result.score}
            <small>/100</small>
          </strong>
        </div>
      </div>
      <dl className={styles.outcomeStats}>
        <div>
          <dt>Total EXP</dt>
          <dd>{result.newExp}</dd>
        </div>
        <div>
          <dt>Hari belajar</dt>
          <dd>{result.newStreak}</dd>
        </div>
        <div>
          <dt>Peringkat</dt>
          <dd>{result.rank}</dd>
        </div>
      </dl>
      <Link href={PROTECTED_ROUTES.academy}>
        Lihat progres tersimpan
        <ArrowUpRight aria-hidden="true" size={16} />
      </Link>
    </section>
  );
}
