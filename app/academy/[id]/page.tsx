import { Suspense } from "react";
import { LearningSkeleton } from "@/components/academy/learning-ui";
import { QuizLessonView } from "@/components/academy/quiz-lesson-view";
import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";
import { requirePageUser } from "@/lib/auth/page-access";
export const metadata = {
  title: "Latihan Academy",
  description: "Kerjakan kuis Guardian Academy dan pelajari pembahasannya.",
};
async function Content({ params }: { params: Promise<{ id: string }> }) {
  const [user, { id }] = await Promise.all([requirePageUser(), params]);
  return <QuizLessonView key={user.id + id} id={id} scope={`${user.id}:${user.role}`} />;
}
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
        <Suspense fallback={<LearningSkeleton />}>
          <Content params={params} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
