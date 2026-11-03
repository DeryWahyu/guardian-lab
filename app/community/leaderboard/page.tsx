import { Suspense } from "react";
import { LearningSkeleton } from "@/components/academy/learning-ui";
import { LeaderboardView } from "@/components/community/leaderboard-view";
import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";
import { requirePageUser } from "@/lib/auth/page-access";
export const metadata = {
  title: "Peringkat Guardian",
  description: "Peringkat belajar berdasarkan EXP akun Guardian.",
};
async function Content() {
  const user = await requirePageUser();
  return <LeaderboardView scope={`${user.id}:${user.role}`} />;
}
export default function Page() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6">
        <Suspense fallback={<LearningSkeleton />}>
          <Content />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
