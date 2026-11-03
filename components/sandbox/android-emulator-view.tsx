import Link from "next/link";
import { PUBLIC_ROUTES } from "@/lib/routes";
export function AndroidEmulatorView() {
  return (
    <section className="max-w-2xl space-y-4 rounded-2xl border border-amber-200 bg-white p-6">
      <h2 className="text-xl font-semibold">Eksekusi Android dinamis belum tersedia</h2>
      <p className="text-sm leading-relaxed text-slate-600">
        Layanan Redroid memerlukan runtime Linux dengan dukungan binder dan jalur streaming yang
        terisolasi. Layanan tersebut belum dikonfigurasi pada lingkungan ini.
      </p>
      <p className="text-sm leading-relaxed text-slate-600">
        Kamu tetap dapat mengunggah APK untuk membaca manifest, izin, kode, dan indikator statis.
        Pemeriksaan statis tidak menjalankan aplikasinya.
      </p>
      <Link
        href={PUBLIC_ROUTES.homeWithTab("apk")}
        className="bg-brand-600 inline-flex min-h-11 items-center rounded-xl px-4 py-2 text-sm font-semibold text-white"
      >
        Buka bedah APK statis
      </Link>
    </section>
  );
}
