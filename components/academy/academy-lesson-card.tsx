import { ArrowRight, Check, FileQuestion, Sparkles } from "lucide-react";
import Link from "next/link";
import { difficultyLabels } from "@/lib/academy/labels";
import { PROTECTED_ROUTES } from "@/lib/routes";
import styles from "./academy-catalog.module.css";
import { type AcademyQuiz, academyTopics } from "./academy-presentation";
import { AcademyTopicArt } from "./academy-topic-art";

export function AcademyLessonCard({ quiz }: { quiz: AcademyQuiz }) {
  const { label } = academyTopics[quiz.category];
  return (
    <article className={styles.lessonCard} data-topic={quiz.category} data-user-reveal>
      <div className={styles.cardCover}>
        <AcademyTopicArt category={quiz.category} thumbnailUrl={quiz.thumbnailUrl} />
        <span className={styles.difficulty}>
          {difficultyLabels[quiz.difficulty] ?? quiz.difficulty}
        </span>
      </div>
      <div className={styles.cardContent}>
        <p className={styles.topicLabel}>{label}</p>
        <h3>{quiz.title}</h3>
        <p className={styles.lessonDescription}>{quiz.description}</p>
        <div className={styles.lessonMeta}>
          <span>
            <FileQuestion aria-hidden="true" size={15} />
            {quiz.questionCount} soal
          </span>
          <span>
            <Sparkles aria-hidden="true" size={15} />
            {quiz.isCompleted ? "EXP sudah diperoleh" : `${quiz.expReward} EXP`}
          </span>
        </div>
        <div className={styles.completion} data-completed={quiz.isCompleted}>
          {quiz.isCompleted && <Check aria-hidden="true" size={14} />}
          {quiz.isCompleted ? "Sudah lulus" : "Siap dipelajari"}
        </div>
        <Link
          href={PROTECTED_ROUTES.academyLesson(quiz.id)}
          className={styles.lessonLink}
          aria-label={`${quiz.isCompleted ? "Latihan ulang" : "Mulai latihan"}: ${quiz.title}`}
        >
          {quiz.isCompleted ? "Ulangi latihan" : "Mulai latihan"}
          <ArrowRight aria-hidden="true" size={17} />
        </Link>
      </div>
    </article>
  );
}
