import { ArrowRight, FileCode2, Globe, Share2, Shield } from "lucide-react";
import Link from "next/link";
import { PUBLIC_ROUTES } from "@/lib/routes";

export function PillarsSection() {
  const pillars = [
    {
      id: "recognize",
      category: "Recognize",
      title: "Kenali Tautan Palsu",
      description:
        "Ajukan tautan atau gambar QR untuk pemeriksaan. URL hasil QR dan status proses tersimpan pada riwayat yang sama.",
      actionLabel: "Coba Analisis URL",
      href: PUBLIC_ROUTES.homeWithTab("url"),
      Icon: Globe,
      cardBg: "bg-white border-border text-foreground",
      iconBg: "bg-brand-50 text-brand-600",
      accentText: "text-brand-600",
    },
    {
      id: "protect",
      category: "Protect",
      title: "Browser Sandbox Terisolasi",
      description:
        "Buka tautan melalui Chromium pada server terisolasi. Sesi dibatasi 180 detik dan unduhan APK masuk karantina server.",
      actionLabel: "Buka Web Sandbox",
      href: PUBLIC_ROUTES.sandboxWeb,
      Icon: Shield,
      cardBg: "bg-white border-border text-foreground",
      iconBg: "bg-brand-50 text-brand-600",
      accentText: "text-brand-600",
    },
    {
      id: "investigate",
      category: "Recognize",
      title: "Bedah Kedok APK",
      description:
        "Baca manifest, izin, serta indikator dari APK tanpa menjalankannya. Konstanta sensitif disamarkan pada hasil statis.",
      actionLabel: "Bongkar APK",
      href: PUBLIC_ROUTES.homeWithTab("apk"),
      Icon: FileCode2,
      cardBg: "bg-white border-border text-foreground",
      iconBg: "bg-brand-50 text-brand-600",
      accentText: "text-brand-600",
    },
    {
      id: "act",
      category: "Act",
      title: "Lindungi Sekitarmu",
      description:
        "Buat Share Card dari hasil lengkap, ajukan kasus untuk moderasi, dan asah pemahaman melalui Academy.",
      actionLabel: "Buat Share Card",
      href: PUBLIC_ROUTES.act,
      Icon: Share2,
      cardBg: "bg-white border-border text-foreground",
      iconBg: "bg-brand-50 text-brand-600",
      accentText: "text-brand-600",
    },
  ];

  return (
    <section className="bg-transparent py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-2xl space-y-3 text-center">
          <div className="border-brand-200/70 bg-brand-50 text-brand-600 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold tracking-wider uppercase">
            KENALAN DULU, YUK
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Banyak cara untuk <span className="text-brand-600">merasa lebih aman.</span>
          </h2>
          <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
            Tak perlu panik saat menerima tautan atau file asing. Pilih instrumen perlindungan yang
            kamu butuhkan hari ini.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar) => (
            <div
              key={pillar.id}
              className={`flex flex-col justify-between gap-6 rounded-3xl border p-6 transition-all hover:scale-[1.02] hover:shadow-lg sm:p-7 ${pillar.cardBg}`}
            >
              <div className="space-y-4">
                <div
                  className={`flex size-12 items-center justify-center rounded-2xl shadow-xs ${pillar.iconBg}`}
                >
                  <pillar.Icon className="size-6" />
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-bold tracking-wider uppercase opacity-75">
                    {pillar.category}
                  </span>
                  <h3 className="text-xl font-extrabold tracking-tight">{pillar.title}</h3>
                </div>
                <p className="text-xs leading-relaxed opacity-90 sm:text-sm">
                  {pillar.description}
                </p>
              </div>

              <Link
                href={pillar.href}
                className={`inline-flex cursor-pointer items-center gap-2 text-xs font-bold transition-all hover:gap-3 sm:text-sm ${pillar.accentText}`}
              >
                <span>{pillar.actionLabel}</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
