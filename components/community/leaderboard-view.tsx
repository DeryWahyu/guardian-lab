"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  LearningProblem,
  LearningSkeleton,
  learningControl,
} from "@/components/academy/learning-ui";
import { useApiResource } from "@/lib/hooks/use-api-resource";
import { API_ROUTES, PROTECTED_ROUTES } from "@/lib/routes";
import { rankingPageSchema, rankingSchema } from "@/lib/validations/platform";
import { RankingList } from "./ranking-list";
export function LeaderboardView({ scope }: { scope: string }) {
  const parsed = rankingPageSchema.safeParse(useSearchParams().get("page") ?? undefined);
  const page = parsed.success ? parsed.data : 1;
  const resource = useApiResource(API_ROUTES.leaderboard(page), rankingSchema, { scope });
  return (
    <div className="space-y-6">
      <Link href={PROTECTED_ROUTES.community} className="text-brand-700 text-sm underline">
        Kembali ke komunitas
      </Link>
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Peringkat belajar Guardian</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-slate-600">
          Diurutkan menurut total EXP akun, lalu urutan pendaftaran jika nilainya sama. Alias
          menjaga identitas anggota.
        </p>
      </div>
      {resource.loading ? (
        <LearningSkeleton />
      ) : resource.problem || !resource.data ? (
        <LearningProblem retry={resource.retry} />
      ) : (
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          {resource.data.items.length ? (
            <RankingList items={resource.data.items} />
          ) : (
            <div className="space-y-3">
              <p>Belum ada peringkat pada halaman ini.</p>
              <Link className="text-brand-700 text-sm underline" href={PROTECTED_ROUTES.academy}>
                Mulai latihan di Academy
              </Link>
            </div>
          )}
          <nav
            aria-label="Halaman peringkat"
            className="mt-5 flex flex-wrap items-center gap-3 text-sm"
          >
            {page > 1 && (
              <Link className={learningControl} href={PROTECTED_ROUTES.leaderboardPage(page - 1)}>
                Sebelumnya
              </Link>
            )}
            <span>
              Halaman {page} dari {resource.data.totalPages}
            </span>
            {page < resource.data.totalPages && (
              <Link className={learningControl} href={PROTECTED_ROUTES.leaderboardPage(page + 1)}>
                Berikutnya
              </Link>
            )}
          </nav>
        </section>
      )}
    </div>
  );
}
