import type { Metadata } from "next";
import { Suspense } from "react";
import { ActPageView } from "@/components/act/act-page-view";
import { ResultSkeleton } from "@/components/landing/results/result-skeleton";
import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";
import { requirePageUser } from "@/lib/auth/page-access";

export const metadata: Metadata = {
  title: "Guardian Share Card | Guardian Lab",
  description: "Buat gambar dan pesan untuk keluarga dari hasil investigasi yang tersimpan.",
};

async function ActContent() {
  const user = await requirePageUser();
  return <ActPageView accessScope={`${user.id}:${user.role}`} />;
}

export default function ActPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col text-slate-800">
      <Header />
      <main className="mx-auto w-full max-w-4xl flex-1 space-y-8 px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-xl space-y-2 text-center">
          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
            Guardian Share Card
          </h1>
          <p className="text-sm leading-relaxed text-slate-600">
            Bagikan ringkasan hasil pemeriksaan ke keluarga dan teman. Isi kartu mengikuti
            investigasi tersimpan, dengan target yang dinonaktifkan.
          </p>
        </div>
        <Suspense fallback={<ResultSkeleton />}>
          <ActContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
