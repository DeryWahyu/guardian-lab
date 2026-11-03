import { PrismaClient } from "@prisma/client";
import { starterLessons } from "../lib/academy/starter-content";
import { demoAccounts, seedDemoAccounts } from "../lib/auth/demo-accounts";

if (process.env.NODE_ENV === "production")
  throw new Error("Seeder akun demo hanya untuk pengembangan lokal.");
const prisma = new PrismaClient();
try {
  await seedDemoAccounts(prisma);
  for (const { questions, ...lesson } of starterLessons)
    await prisma.quiz.upsert({
      where: { id: lesson.id },
      update: {},
      create: {
        ...lesson,
        questions: { create: questions.map((q, i) => ({ ...q, order: i + 1 })) },
      },
    });
  for (const account of demoAccounts) console.log(`${account.role}: ${account.email}`);
  console.log("Akun lokal siap. Riwayat, EXP, dan konten yang sudah ada tetap tersimpan.");
} finally {
  await prisma.$disconnect();
}
