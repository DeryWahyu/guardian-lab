import { starterLessons } from "../lib/academy/starter-content";
import { prisma } from "../lib/prisma";

try {
  for (const { questions, ...lesson } of starterLessons) {
    await prisma.quiz.upsert({
      where: { id: lesson.id },
      update: {},
      create: {
        ...lesson,
        questions: { create: questions.map((q, i) => ({ ...q, order: i + 1 })) },
      },
    });
  }
  console.log("Tiga materi awal Academy tersedia. Akun dan kuis yang sudah ada tidak diubah.");
} finally {
  await prisma.$disconnect();
}
