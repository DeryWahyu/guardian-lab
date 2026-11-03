"use client";
import Link from "next/link";
import { PROTECTED_ROUTES } from "@/lib/routes";
import { LearningProblem, LearningSkeleton, learningControl } from "./learning-ui";
import { useQuizAttempt } from "./use-quiz-attempt";
export function QuizLessonView({ id, scope }: { id: string; scope: string }) {
  const attempt = useQuizAttempt(id, scope);
  const quiz = attempt.resource.data;
  if (attempt.resource.loading) return <LearningSkeleton />;
  if (!quiz || attempt.resource.problem) return <LearningProblem retry={attempt.resource.retry} />;
  return (
    <div className="space-y-6">
      <Link href={PROTECTED_ROUTES.academy} className="text-brand-700 text-sm underline">
        Kembali ke Academy
      </Link>
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold">{quiz.title}</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-slate-600">{quiz.description}</p>
        <p className="text-sm">
          Lulus minimal 70%.{" "}
          {quiz.isCompleted
            ? "EXP kuis ini sudah diperoleh; latihan ulang tetap tersimpan."
            : `Hadiah kelulusan pertama: ${quiz.expReward} EXP.`}
        </p>
      </div>
      {attempt.result && (
        <section
          aria-live="polite"
          className={`space-y-2 rounded-2xl border p-6 ${attempt.result.passed ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}
        >
          <h2 className="text-xl font-semibold">
            Nilai {attempt.result.score}/100 —{" "}
            {attempt.result.passed ? "Lulus" : "Coba pelajari kembali"}
          </h2>
          <p>
            {attempt.result.correctCount} dari {attempt.result.totalQuestions} soal benar. +
            {attempt.result.expEarned} EXP.
          </p>
          <p className="text-sm">
            Total {attempt.result.newExp} EXP · {attempt.result.newStreak} hari belajar ·{" "}
            {attempt.result.rank}
          </p>
          <Link href={PROTECTED_ROUTES.academy} className="inline-block text-sm underline">
            Lihat progres tersimpan
          </Link>
        </section>
      )}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void attempt.submit();
        }}
        className="space-y-5"
      >
        {quiz.questions.map((q, index) => {
          const feedback = attempt.result?.feedback.find((f) => f.questionId === q.id);
          return (
            <fieldset
              key={q.id}
              disabled={attempt.pending || Boolean(attempt.result)}
              className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
            >
              <legend className="sr-only">Soal {index + 1}</legend>
              <p className="text-sm font-semibold [overflow-wrap:anywhere]">
                {index + 1}. {q.questionText}
              </p>
              <p className="text-xs text-slate-500">
                {q.multiple ? "Pilih semua jawaban yang sesuai." : "Pilih satu jawaban."}
              </p>
              <div className="space-y-2">
                {q.options.map((o) => (
                  <label
                    key={o.id}
                    className="has-checked:border-brand-600 has-checked:bg-brand-50 flex min-h-11 cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-3 text-sm"
                  >
                    <input
                      type={q.multiple ? "checkbox" : "radio"}
                      name={q.id}
                      checked={attempt.answers[q.id]?.includes(o.id) ?? false}
                      onChange={() => attempt.choose(q.id, o.id, q.multiple)}
                      className="accent-brand-600 mt-1"
                    />
                    <span className="[overflow-wrap:anywhere]">{o.text}</span>
                  </label>
                ))}
              </div>
              {feedback && (
                <div className="space-y-2 border-t border-slate-200 pt-3 text-sm">
                  <p className="font-semibold">
                    {feedback.correct ? "Jawaban benar" : "Jawaban belum tepat"}
                  </p>
                  <p>Jawaban: {feedback.correctAnswers.join("; ")}</p>
                  <p className="leading-relaxed [overflow-wrap:anywhere] text-slate-600">
                    {feedback.explanation}
                  </p>
                </div>
              )}
            </fieldset>
          );
        })}
        {attempt.error && (
          <p role="alert" className="text-sm text-rose-700">
            {attempt.error}
          </p>
        )}
        {!attempt.result && (
          <button
            type="submit"
            disabled={attempt.pending}
            className="bg-brand-600 min-h-11 rounded-xl px-5 py-3 font-semibold text-white disabled:opacity-50"
          >
            {attempt.pending ? "Menyimpan jawaban…" : "Kirim jawaban"}
          </button>
        )}
      </form>
      {attempt.result && (
        <button type="button" className={learningControl} onClick={() => window.location.reload()}>
          Latihan ulang
        </button>
      )}
    </div>
  );
}
