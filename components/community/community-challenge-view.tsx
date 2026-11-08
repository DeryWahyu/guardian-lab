"use client";
import Link from "next/link";
import {
  LearningProblem,
  LearningSkeleton,
  learningControl,
} from "@/components/academy/learning-ui";
import { FeatureIcon } from "@/components/shared/feature-icon";
import workspace from "@/components/workspace/workspace.module.css";
import { WorkspaceMascot } from "@/components/workspace/workspace-mascot";
import { PROTECTED_ROUTES } from "@/lib/routes";
import { useCommunityChallenge } from "./use-community-challenge";
export function CommunityChallengeView({ id, scope }: { id: string; scope: string }) {
  const attempt = useCommunityChallenge(id, scope);
  const data = attempt.resource.data;
  if (attempt.resource.loading) return <LearningSkeleton presentation="workspace" />;
  if (!data || attempt.resource.problem)
    return <LearningProblem presentation="workspace" retry={attempt.resource.retry} />;
  return (
    <section
      aria-labelledby="challenge-title"
      className={`${workspace.panel} space-y-5`}
      data-user-reveal
    >
      <div className="space-y-2">
        <h2 id="challenge-title" className="flex items-center gap-3 text-xl font-semibold">
          <FeatureIcon name="casebook" />
          Uji pemahaman kasus
        </h2>
        <p className="text-sm text-slate-600">
          Gunakan bukti pada snapshot di atas. Selesaikan semua pertanyaan dengan benar untuk
          memperoleh {data.expReward} EXP pada kelulusan pertama.
        </p>
        {data.isSolved && (
          <p className="text-sm text-emerald-700">
            Kasus ini sudah diselesaikan. Latihan ulang tidak menambah EXP.
          </p>
        )}
      </div>
      {attempt.result && (
        <output
          className={`block space-y-2 rounded-xl p-4 text-sm ${attempt.result.passed ? "bg-emerald-50" : "bg-amber-50"}`}
        >
          <h3 className="flex flex-wrap items-center gap-3 text-lg font-semibold">
            <FeatureIcon name={attempt.result.passed ? "case" : "progress"} />
            Nilai {attempt.result.score}/100 ·{" "}
            {attempt.result.passed ? "Kasus diselesaikan" : "Pelajari bukti kembali"}
          </h3>
          <p>
            {attempt.result.correctCount} dari {attempt.result.totalQuestions} benar. +
            {attempt.result.expEarned} EXP.
          </p>
          {attempt.result.passed && <WorkspaceMascot pose="success" reaction="success" small />}
          <Link href={PROTECTED_ROUTES.academy} className="inline-block underline">
            Lihat progres belajar
          </Link>
        </output>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void attempt.submit();
        }}
        className="space-y-5"
      >
        {data.questions.map((q, i) => {
          const feedback = attempt.result?.feedback.find((f) => f.questionId === q.id);
          return (
            <fieldset
              key={q.id}
              disabled={attempt.pending || Boolean(attempt.result)}
              className="space-y-3"
            >
              <legend className="mb-3 text-sm font-semibold">
                {i + 1}. {q.questionText}
              </legend>
              {q.options.map((option) => (
                <label key={option.id} className={workspace.answerOption}>
                  <input
                    type="radio"
                    name={`case-${q.id}`}
                    checked={attempt.answers[q.id] === option.id}
                    onChange={() => attempt.choose(q.id, option.id)}
                    className="accent-brand-600 mt-1"
                  />
                  <span className="[overflow-wrap:anywhere]">{option.text}</span>
                </label>
              ))}
              {feedback && (
                <div className="space-y-2 text-sm">
                  <p className="font-semibold">
                    {feedback.correct ? "Jawaban benar" : "Jawaban belum tepat"}
                  </p>
                  <p>{feedback.correctAnswers.join("; ")}</p>
                  <p className="text-slate-600">{feedback.explanation}</p>
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
          <button type="submit" disabled={attempt.pending} className={workspace.primary}>
            {attempt.pending ? "Menyimpan hasil..." : "Kirim jawaban kasus"}
          </button>
        )}
      </form>
      {attempt.result && (
        <button type="button" className={learningControl} onClick={() => window.location.reload()}>
          Latihan kasus ulang
        </button>
      )}
    </section>
  );
}
