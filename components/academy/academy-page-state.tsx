import { BookOpen, RefreshCw } from "lucide-react";
import Link from "next/link";
import type { LoadProblem } from "@/lib/investigations/client";
import { AUTH_ROUTES, PROTECTED_ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import styles from "./academy.module.css";

export function AcademySkeleton({ lesson = false }: { lesson?: boolean }) {
  return (
    <output
      aria-label={lesson ? "Memuat latihan" : "Memuat ruang belajar"}
      aria-busy="true"
      className={styles.skeleton}
    >
      <div
        className={cn(styles.skeletonHero, lesson && styles.skeletonLessonHero)}
        aria-hidden="true"
      >
        <div className={styles.skeletonCopy}>
          <span />
          <span />
          <span />
        </div>
        {!lesson && <div className={styles.skeletonArtwork} />}
      </div>
      {!lesson && (
        <div className={styles.skeletonMetrics} aria-hidden="true">
          {[0, 1, 2, 3, 4].map((item) => (
            <span key={item} />
          ))}
        </div>
      )}
      <div className={cn(styles.skeletonBody, lesson && styles.skeletonReading)} aria-hidden="true">
        {(lesson ? [0, 1] : [0, 1, 2]).map((item) => (
          <div key={item}>
            <span />
            <span />
            <span />
          </div>
        ))}
      </div>
      {!lesson && (
        <>
          <div className={styles.skeletonOverview} aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className={styles.skeletonActivity} aria-hidden="true" />
        </>
      )}
    </output>
  );
}

export function AcademyProblem({
  retry,
  problem,
  lesson = false,
}: {
  retry: () => void;
  problem?: LoadProblem | null;
  lesson?: boolean;
}) {
  return (
    <section className={styles.problem} role="alert">
      <span>
        <BookOpen aria-hidden="true" size={30} />
      </span>
      <h1>
        {problem?.kind === "not_found"
          ? "Latihan belum ditemukan."
          : problem?.kind === "forbidden"
            ? "Latihan ini belum dapat diakses."
            : problem?.kind === "unauthenticated"
              ? "Masuk kembali untuk belajar."
              : "Ruang belajar belum dapat dimuat."}
      </h1>
      <p>
        {problem?.message ??
          "Materi atau progres belajar belum dapat dimuat. Coba kembali, atau masuk kembali jika sesimu telah berakhir."}
      </p>
      <div>
        {(!problem || problem.retryable) && (
          <button type="button" onClick={retry} className={styles.primaryButton}>
            <RefreshCw aria-hidden="true" size={17} />
            Coba lagi
          </button>
        )}
        {(!problem || problem.kind === "unauthenticated") && (
          <Link href={AUTH_ROUTES.login} className={styles.secondaryButton}>
            Masuk kembali
          </Link>
        )}
        {lesson && (
          <Link href={PROTECTED_ROUTES.academy} className={styles.secondaryButton}>
            Kembali ke Belajar
          </Link>
        )}
      </div>
    </section>
  );
}
