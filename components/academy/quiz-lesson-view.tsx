"use client";

import { ArrowLeft, BookOpen, CheckCheck, RotateCcw, Send } from "lucide-react";
import Link from "next/link";
import { difficultyLabels } from "@/lib/academy/labels";
import { PROTECTED_ROUTES } from "@/lib/routes";
import { AcademyProblem, AcademySkeleton } from "./academy-page-state";
import { academyTopics } from "./academy-presentation";
import { QuizOutcome } from "./quiz-outcome";
import { QuizQuestion } from "./quiz-question";
import { useQuizAttempt } from "./use-quiz-attempt";
import shared from "./academy.module.css";
import styles from "./quiz-lesson.module.css";

export function QuizLessonView({ id, scope }: { id: string; scope: string }) {
  const attempt = useQuizAttempt(id, scope);
  const quiz = attempt.resource.data;
  if (attempt.resource.loading) return <AcademySkeleton lesson />;
  if (!quiz || attempt.resource.problem)
    return (
      <AcademyProblem lesson problem={attempt.resource.problem} retry={attempt.resource.retry} />
    );
  const answeredCount = quiz.questions.filter(
    (question) => attempt.answers[question.id]?.length,
  ).length;
  return (
    <div className={styles.lesson}>
      <Link href={PROTECTED_ROUTES.academy} className={styles.backLink}>
        <ArrowLeft aria-hidden="true" size={17} />
        Kembali ke Belajar
      </Link>
      <header className={styles.lessonHeader} data-user-reveal>
        <p className={styles.lessonTopic}>
          <BookOpen aria-hidden="true" size={17} />
          {academyTopics[quiz.category].label}
        </p>
        <h1>{quiz.title}</h1>
        <p className={styles.lessonDescription}>{quiz.description}</p>
        <ul className={styles.lessonMeta}>
          <li>{quiz.questions.length} soal</li>
          <li>{difficultyLabels[quiz.difficulty] ?? quiz.difficulty}</li>
          <li>Lulus minimal 70%</li>
        </ul>
        <p className={styles.rewardNote}>
          {quiz.isCompleted
            ? "EXP kuis ini sudah diperoleh; latihan ulang tetap tersimpan."
            : `Hadiah kelulusan pertama: ${quiz.expReward} EXP.`}
        </p>
        <div className={styles.answerProgress}>
          <span aria-live="polite">
            {answeredCount} dari {quiz.questions.length} soal terjawab
          </span>
          <progress
            max={Math.max(1, quiz.questions.length)}
            value={answeredCount}
            aria-label="Soal terjawab"
          />
        </div>
      </header>
      {attempt.result && <QuizOutcome result={attempt.result} />}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void attempt.submit();
        }}
        className={styles.quizForm}
        aria-busy={attempt.pending}
      >
        {quiz.questions.map((question, index) => (
          <QuizQuestion
            key={question.id}
            question={question}
            index={index}
            selected={attempt.answers[question.id] ?? []}
            feedback={attempt.result?.feedback.find((item) => item.questionId === question.id)}
            disabled={attempt.pending || Boolean(attempt.result)}
            onChoose={(optionId) => attempt.choose(question.id, optionId, question.multiple)}
          />
        ))}
        {attempt.error && (
          <p role="alert" className={styles.error}>
            {attempt.error}
          </p>
        )}
        {!attempt.result && (
          <div className={styles.submitPanel}>
            <div>
              <strong>
                {answeredCount} / {quiz.questions.length} soal terjawab
              </strong>
              <p>Periksa pilihanmu sebelum mengirim.</p>
            </div>
            <button type="submit" disabled={attempt.pending} className={shared.primaryButton}>
              <Send aria-hidden="true" size={17} />
              {attempt.pending ? "Menyimpan jawaban..." : "Kirim jawaban"}
            </button>
          </div>
        )}
      </form>
      {attempt.result && (
        <div className={styles.reviewActions}>
          <button
            type="button"
            className={shared.secondaryButton}
            onClick={() => window.location.reload()}
          >
            <RotateCcw aria-hidden="true" size={17} />
            Latihan ulang
          </button>
          <Link href={PROTECTED_ROUTES.academy} className={shared.primaryButton}>
            <CheckCheck aria-hidden="true" size={17} />
            Kembali ke perjalananmu
          </Link>
        </div>
      )}
    </div>
  );
}
