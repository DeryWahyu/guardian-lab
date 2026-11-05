import { PrismaClient } from "@prisma/client";
import { seedAcademy } from "./seeders/academy";
import { demoAccounts, seedDemoAccounts } from "./seeders/demo-accounts";

if (process.env.NODE_ENV === "production")
  throw new Error("Seeder akun demo hanya untuk pengembangan lokal.");
const prisma = new PrismaClient();
try {
  await seedDemoAccounts(prisma);
  await seedAcademy(prisma);
  for (const account of demoAccounts) console.log(`${account.role}: ${account.email}`);
  console.log("Akun lokal siap. Riwayat, EXP, dan konten yang sudah ada tetap tersimpan.");
} finally {
  await prisma.$disconnect();
}
