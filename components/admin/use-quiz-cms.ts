"use client";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useApiResource } from "@/lib/hooks/use-api-resource";
import { API_ROUTES } from "@/lib/routes";
import { adminQuizSchema, type QuizInput, quizInputSchema } from "@/lib/validations/academy";
import { blankQuestion } from "./quiz-editor";

const schema = z.array(adminQuizSchema);
type Editor = { id?: string; revision?: string; value: QuizInput };
export function useQuizCms(scope: string) {
  const [page, setPage] = useState(1);
  const list = useApiResource(API_ROUTES.adminQuizzesPage(page), schema, { scope });
  const [editor, setEditor] = useState<Editor | null>(null);
  const [archive, setArchive] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const controller = useRef<AbortController | null>(null);
  useEffect(
    () => () => {
      const current = controller.current;
      controller.current = null;
      current?.abort();
    },
    [],
  );
  function create() {
    setError(null);
    setEditor({
      value: {
        title: "",
        description: "",
        category: "SPOT_THE_PHISH",
        difficulty: "EASY",
        expReward: 50,
        published: false,
        questions: [blankQuestion()],
      },
    });
  }
  async function mutate(remove = false) {
    if (pending || controller.current || list.problem) return;
    const input = editor ? quizInputSchema.safeParse(editor.value) : null;
    if (!remove && !input?.success) {
      setError("Lengkapi materi, pilihan, dan minimal satu kunci jawaban untuk setiap soal.");
      return;
    }
    const abort = new AbortController();
    controller.current = abort;
    setPending(true);
    setError(null);
    const timeout = setTimeout(() => abort.abort(), 30000);
    try {
      const url =
        remove && archive
          ? API_ROUTES.adminQuiz(archive)
          : editor?.id
            ? API_ROUTES.adminQuiz(editor.id)
            : API_ROUTES.adminQuizzes;
      const response = await fetch(url, {
        method: remove ? "DELETE" : editor?.id ? "PUT" : "POST",
        signal: abort.signal,
        headers: { "Content-Type": "application/json" },
        body: remove
          ? undefined
          : JSON.stringify({
              ...input?.data,
              ...(editor?.revision ? { revision: editor.revision } : {}),
            }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Kuis belum tersimpan.");
      if (abort.signal.aborted) return;
      setEditor(null);
      setArchive(null);
      setPage(1);
      list.retry();
      toast.success(remove ? "Kuis diarsipkan. Riwayat tetap tersimpan." : "Kuis tersimpan.");
    } catch (cause) {
      if (controller.current !== abort) return;
      if (!abort.signal.aborted) {
        const message =
          cause instanceof TypeError
            ? "Koneksi terputus. Coba kembali."
            : cause instanceof Error
              ? cause.message
              : "Permintaan gagal.";
        setError(message);
        toast.error(message);
      } else {
        setError("Pengiriman belum terkonfirmasi. Muat ulang daftar sebelum mencoba lagi.");
      }
    } finally {
      clearTimeout(timeout);
      if (controller.current === abort) {
        controller.current = null;
        setPending(false);
      }
    }
  }
  return {
    list,
    editor,
    setEditor,
    archive,
    setArchive,
    pending,
    error,
    setError,
    create,
    mutate,
    page,
    setPage,
  };
}
