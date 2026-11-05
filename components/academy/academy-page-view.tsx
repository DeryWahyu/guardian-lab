"use client";
import Link from "next/link";
import { z } from "zod";
import { WorkspaceStage } from "@/components/workspace/workspace-stage";
import { WorkspaceEmpty } from "@/components/workspace/workspace-state";
import workspace from "@/components/workspace/workspace.module.css";
import { difficultyLabels } from "@/lib/academy/labels";
import { useApiResource } from "@/lib/hooks/use-api-resource";
import { API_ROUTES, PROTECTED_ROUTES } from "@/lib/routes";
import { academyProgressSchema, quizSummarySchema } from "@/lib/validations/academy";
import { LearningProblem, LearningSkeleton } from "./learning-ui";

const listSchema = z.array(quizSummarySchema);
export function AcademyPageView({ scope }: { scope: string }) {
  const list = useApiResource(API_ROUTES.quizzes, listSchema, { scope });
  const progress = useApiResource(API_ROUTES.academyProgress, academyProgressSchema, { scope });
  if (list.loading || progress.loading) return <LearningSkeleton presentation="workspace" />;
  if (list.problem || progress.problem || !list.data || !progress.data)
    return (
      <LearningProblem
        presentation="workspace"
        retry={() => {
          list.retry();
          progress.retry();
        }}
      />
    );
  const data = progress.data;
  return (
    <div className="space-y-8">
      <WorkspaceStage
        title="Latih nalurimu, selangkah setiap hari."
        description="Pelajari cara mengenali jebakan digital. Pilih latihanmu, baca pembahasannya, dan lihat progres belajar yang tersimpan."
        pose="academy"
        tone="yellow"
      >
        <section aria-label="Progres belajar" className={workspace.panel}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Peringkat akun</p>
              <h2 className="text-2xl font-semibold">{data.rank}</h2>
            </div>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <dt className="text-xs text-slate-500">EXP</dt>
                <dd className="text-xl font-semibold">{data.exp}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Hari belajar berturut-turut</dt>
                <dd className="text-xl font-semibold">{data.streakDays}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Kuis lulus</dt>
                <dd className="text-xl font-semibold">{data.completed}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Kasus diselesaikan</dt>
                <dd className="text-xl font-semibold">{data.casesSolved}</dd>
              </div>
            </dl>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Hari belajar dihitung dalam WIB. EXP diberikan sekali pada kelulusan pertama setiap kuis
            atau kasus.
          </p>
        </section>
      </WorkspaceStage>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Latihan mengenali ancaman</h2>
        {!list.data.length ? (
          <WorkspaceEmpty
            pose="academy"
            title="Latihan sedang dipersiapkan."
            description="Belum ada latihan yang diterbitkan. Materi akan tersedia setelah admin menerbitkan kuis."
          />
        ) : (
          <div className={workspace.grid}>
            {list.data.map((q) => (
              <article key={q.id} className={workspace.lessonCard}>
                <div className="max-w-2xl space-y-2">
                  <p className="text-xs text-slate-500">
                    {q.questionCount} soal / {difficultyLabels[q.difficulty] ?? q.difficulty} /{" "}
                    {q.expReward} EXP
                  </p>
                  <h3 className="text-lg font-semibold">{q.title}</h3>
                  <p className="text-sm text-slate-600">{q.description}</p>
                  <p className={workspace.statusChip}>
                    {q.isCompleted ? "Sudah lulus" : "Belum diselesaikan"}
                  </p>
                </div>
                <Link
                  href={PROTECTED_ROUTES.academyLesson(q.id)}
                  className={q.isCompleted ? workspace.secondary : workspace.primary}
                >
                  {q.isCompleted ? "Latihan ulang" : "Mulai latihan"}
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
      <section className={`${workspace.panel} space-y-3`}>
        <h2 className="text-xl font-semibold">Lencana diperoleh</h2>
        {!data.badges.length ? (
          <p className="text-sm text-slate-500">Lulus satu kuis untuk meraih lencana pertamamu.</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {data.badges.map((b) => (
              <li key={b.id} className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="font-semibold">{b.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{b.description}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className={`${workspace.panel} space-y-3`}>
        <h2 className="text-xl font-semibold">10 latihan terakhir</h2>
        {!data.recentAttempts.length ? (
          <p className="text-sm text-slate-500">Belum ada latihan yang dikirim.</p>
        ) : (
          <ul className="divide-y divide-slate-200">
            {data.recentAttempts.map((a) => (
              <li key={a.id} className="flex flex-wrap justify-between gap-3 py-3 text-sm">
                <span>{a.title}</span>
                <span>
                  Nilai {a.score} / +{a.expEarned} EXP /{" "}
                  {new Date(a.completedAt).toLocaleDateString("id-ID")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
