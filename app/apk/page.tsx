import { ArrowLeft, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { ApkInvestigation } from "@/components/apk/apk-investigation";
import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";
import { requirePageUser } from "@/lib/auth/page-access";
import { PROTECTED_ROUTES, PUBLIC_ROUTES } from "@/lib/routes";

type Props = {
  searchParams: Promise<{ investigation?: string | string[]; mode?: string | string[] }>;
};

export const metadata = {
  title: "Bedah APK — Guardian Lab",
  description: "Periksa manifest, izin, dan kode APK secara statis tanpa memasangnya di perangkat.",
};

async function ApkContent({ searchParams }: Props) {
  const query = await searchParams;
  const id = typeof query.investigation === "string" ? query.investigation : undefined;
  const returnTo = id
    ? PROTECTED_ROUTES.apkWithInvestigation(id, query.mode === "geek" ? "geek" : undefined)
    : PROTECTED_ROUTES.apkWithMode(query.mode === "geek" ? "geek" : "human");
  const user = await requirePageUser(undefined, returnTo);
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Header initialUser={user} />
      <main className="mx-auto w-full max-w-5xl flex-1 space-y-8 px-4 py-10 sm:px-6">
        <div className="max-w-2xl space-y-4">
          <Link
            href={PUBLIC_ROUTES.home}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm text-slate-600"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Kembali ke beranda
          </Link>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-800">
            <LockKeyhole className="size-4" aria-hidden="true" /> Pemeriksaan tersimpan di akunmu
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Bedah file APK</h1>
          <p className="text-sm leading-relaxed text-slate-600">
            Lihat manifest, izin, kode, dan indikator statis aplikasi Android. Pemeriksaan ini tidak
            memasang atau menjalankan APK di perangkatmu.
          </p>
        </div>
        <ApkInvestigation user={user} />
      </main>
      <Footer />
    </div>
  );
}

function ApkPageSkeleton() {
  return (
    <div role="status" aria-label="Memeriksa sesi APK" className="mx-auto max-w-5xl space-y-8 p-8">
      <div className="h-12 w-56 max-w-full animate-pulse rounded-xl bg-slate-200 motion-reduce:animate-none" />
      <div className="h-96 animate-pulse rounded-3xl bg-slate-100 motion-reduce:animate-none" />
    </div>
  );
}

export default function ApkPage(props: Props) {
  return (
    <Suspense fallback={<ApkPageSkeleton />}>
      <ApkContent {...props} />
    </Suspense>
  );
}
