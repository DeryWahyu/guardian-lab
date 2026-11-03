"use client";
import {
  LearningProblem,
  LearningSkeleton,
  learningControl,
} from "@/components/academy/learning-ui";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { QuizEditor } from "./quiz-editor";
import { useQuizCms } from "./use-quiz-cms";
export function QuizCmsView({ scope }: { scope: string }) {
  const cms = useQuizCms(scope);
  const list = cms.list;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold">Bank soal Academy</h1>
          <p className="mt-2 text-sm text-slate-600">
            Susun materi, pilihan jawaban, pembahasan, dan status publikasi. Pengarsipan
            mempertahankan progres pengguna.
          </p>
        </div>
        <button
          className={learningControl}
          type="button"
          disabled={cms.pending || Boolean(list.problem) || Boolean(cms.editor)}
          onClick={cms.create}
        >
          Buat kuis
        </button>
      </div>
      {list.loading ? (
        <LearningSkeleton />
      ) : list.problem || !list.data ? (
        <LearningProblem retry={list.retry} />
      ) : (
        <>
          {cms.editor && (
            <QuizEditor
              value={cms.editor.value}
              change={(value) => cms.setEditor({ ...cms.editor, value })}
              pending={cms.pending}
              save={() => void cms.mutate()}
              cancel={() => cms.setEditor(null)}
              error={cms.error}
            />
          )}
          {!list.data.length ? (
            <p className="rounded-xl border border-dashed border-slate-300 p-6">
              Belum ada kuis. Buat materi pertama untuk Academy.
            </p>
          ) : (
            <ul className="space-y-3">
              {list.data.map((q) => (
                <li
                  key={q.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5"
                >
                  <div>
                    <h2 className="font-semibold">{q.title}</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {q.published ? "Terbit" : "Draf / arsip"} / {q.questions.length} soal /{" "}
                      {q.expReward} EXP
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className={learningControl}
                      disabled={cms.pending || Boolean(cms.editor)}
                      onClick={() => {
                        cms.setError(null);
                        cms.setEditor({ id: q.id, revision: q.updatedAt, value: q });
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className={learningControl}
                      disabled={cms.pending || !q.published}
                      onClick={() => {
                        cms.setError(null);
                        cms.setArchive(q.id);
                      }}
                    >
                      Arsipkan
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
      <nav aria-label="Halaman bank soal" className="flex flex-wrap items-center gap-3 text-sm">
        <button
          type="button"
          className={learningControl}
          disabled={cms.page <= 1 || cms.pending || Boolean(cms.editor) || list.loading}
          onClick={() => cms.setPage(cms.page - 1)}
        >
          Sebelumnya
        </button>
        <span>Halaman {cms.page} · 10 kuis per halaman</span>
        <button
          type="button"
          className={learningControl}
          disabled={
            !list.data ||
            list.data.length < 10 ||
            cms.pending ||
            Boolean(cms.editor) ||
            list.loading
          }
          onClick={() => cms.setPage(cms.page + 1)}
        >
          Berikutnya
        </button>
      </nav>
      <ConfirmDialog
        open={Boolean(cms.archive)}
        onOpenChange={(open) => {
          if (!open) cms.setArchive(null);
        }}
        title="Arsipkan kuis?"
        description="Kuis akan disembunyikan dari pengguna. Riwayat latihan dan EXP yang sudah diperoleh tetap tersimpan."
        pending={cms.pending}
        error={cms.error}
        confirmLabel="Arsipkan kuis"
        onConfirm={() => void cms.mutate(true)}
      />
    </div>
  );
}
