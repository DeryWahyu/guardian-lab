import { Suspense } from "react";
import { AcademyPageView } from "@/components/academy/academy-page-view";
import { LearningSkeleton } from "@/components/academy/learning-ui";
import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";
import { requirePageUser } from "@/lib/auth/page-access";
export const metadata = {
  title: "Guardian Academy",
  description: "Latihan mengenali ancaman digital dan progres belajar akunmu.",
};
async function Content() {
  const user = await requirePageUser();
  return <AcademyPageView scope={`${user.id}:${user.role}`} />;
}
export default function Page() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 space-y-8 px-4 py-8 sm:px-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">Guardian Academy</h1>
          <p className="max-w-xl text-sm text-slate-600">
            Latih kebiasaan memeriksa tautan, pesan, dan izin aplikasi sebelum mempercayainya.
          </p>
        </div>
        <Suspense fallback={<LearningSkeleton />}>
          <Content />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
