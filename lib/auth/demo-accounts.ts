import type { PrismaClient } from "@prisma/client";
import { hashPassword, verifyPassword } from "./password";

export const demoAccounts = [
  { email: "admin@gmail.com", name: "Admin Guardian", role: "ADMIN" as const },
  { email: "dery@gmail.com", name: "Dery", role: "USER" as const },
  { email: "gading@gmail.com", name: "Gading", role: "USER" as const },
  { email: "rafli@gmail.com", name: "Rafli", role: "USER" as const },
];

export async function seedDemoAccounts(database: PrismaClient) {
  const ids: string[] = [];
  for (const account of demoAccounts) {
    const existing = await database.user.findUnique({ where: { email: account.email } });
    const passwordMatches = existing
      ? await verifyPassword("password", existing.passwordHash)
      : false;
    const passwordHash =
      passwordMatches && existing ? existing.passwordHash : await hashPassword("password");
    const user = await database.$transaction(async (tx) => {
      const saved = await tx.user.upsert({
        where: { email: account.email },
        create: { ...account, passwordHash },
        update: { role: account.role, passwordHash },
      });
      if (existing && (!passwordMatches || existing.role !== account.role))
        await tx.session.deleteMany({ where: { userId: saved.id } });
      return saved;
    });
    ids.push(user.id);
  }
  return ids;
}
