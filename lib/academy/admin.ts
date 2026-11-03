import type { Prisma } from "@prisma/client";
import { InputError } from "@/lib/investigations/request-input";
import { prisma } from "@/lib/prisma";
import { sanitizeShareText } from "@/lib/share-card/content";
import { type QuizInput, quizInputSchema } from "@/lib/validations/academy";

export async function adminQuizzes(page = 1) {
  return prisma.quiz.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    skip: (page - 1) * 10,
    include: { questions: { orderBy: { order: "asc" } } },
  });
}
function clean(input: QuizInput) {
  return {
    ...input,
    title: sanitizeShareText(input.title),
    description: sanitizeShareText(input.description),
    questions: input.questions.map((q, i) => ({
      ...q,
      order: i + 1,
      questionText: sanitizeShareText(q.questionText),
      explanation: sanitizeShareText(q.explanation),
      options: q.options.map((o) => ({ id: o.id, text: sanitizeShareText(o.text) })),
    })),
  };
}
export async function saveQuiz(input: QuizInput, id?: string, revision?: string) {
  const sanitized = clean(input);
  quizInputSchema.parse(sanitized);
  const { questions, ...fields } = sanitized;
  return prisma.$transaction(async (tx) => {
    if (id) {
      const matched = await tx.quiz.updateMany({
        where: { id, updatedAt: revision ? new Date(revision) : undefined },
        data: { ...fields, updatedAt: new Date() },
      });
      if (!matched.count)
        throw new InputError("Kuis telah berubah. Muat ulang sebelum menyimpan.", 409);
      await tx.quizQuestion.deleteMany({ where: { quizId: id } });
      await tx.quizQuestion.createMany({
        data: questions.map((q) => ({
          ...q,
          quizId: id,
          options: q.options as Prisma.InputJsonValue,
        })),
      });
      return tx.quiz.findUniqueOrThrow({
        where: { id },
        include: { questions: { orderBy: { order: "asc" } } },
      });
    }
    return tx.quiz.create({
      data: { ...fields, questions: { create: questions } },
      include: { questions: { orderBy: { order: "asc" } } },
    });
  });
}
export async function archiveQuiz(id: string) {
  const changed = await prisma.quiz.updateMany({ where: { id }, data: { published: false } });
  if (!changed.count) throw new InputError("Kuis tidak ditemukan.", 404);
  return { success: true, message: "Kuis diarsipkan. Riwayat dan EXP pengguna tetap tersimpan." };
}
