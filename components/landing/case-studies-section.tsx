import { ArrowRight, FileCode2, QrCode, Terminal } from "lucide-react";
import Link from "next/link";
import { PROTECTED_ROUTES, PUBLIC_ROUTES } from "@/lib/routes";

export function CaseStudiesSection() {
  const articles = [
    {
      id: "apk-undangan-nikah",
      tag: "MALWARE ANDROID",
      action: "Unggah APK untuk diperiksa",
      title: "Anatomi APK Undangan Nikah & Modus Kurir Paket",
      excerpt:
        "Bagaimana malware SMS-stealer membajak izin RECEIVE_SMS untuk mencegat kode OTP perbankan dan menguras rekening korban.",
      href: PUBLIC_ROUTES.homeWithTab("apk"),
      Icon: FileCode2,
      accentBg: "from-brand-600/10 to-transparent",
      tagColor: "bg-brand-50 text-brand-700",
    },
    {
      id: "quishing-qris",
      tag: "QR PHISHING",
      action: "Baca gambar QR",
      title: "Waspada Quishing QRIS Palsu di Tempat Ibadah & Parkir",
      excerpt:
        "Eksploitasi stiker QRIS donasi palsu yang mengalihkan pembayaran ke rekening penampung sindikat penipuan.",
      href: PUBLIC_ROUTES.homeWithTab("qr"),
      Icon: QrCode,
      accentBg: "from-brand-600/10 to-transparent",
      tagColor: "bg-brand-50 text-brand-700",
    },
    {
      id: "c2-telegram",
      tag: "FORENSIK TEKNIS",
      action: "Buka materi Academy",
      title: "Kenali Tanda Phishing dan Lindungi Akun",
      excerpt:
        "Pelajari cara mengenali tautan mencurigakan, menjaga akun, dan memilih tindakan melalui materi serta kuis yang tersedia.",
      href: PROTECTED_ROUTES.academy,
      Icon: Terminal,
      accentBg: "from-brand-600/10 to-transparent",
      tagColor: "bg-brand-50 text-brand-700",
    },
  ];

  return (
    <section className="border-t border-slate-200/60 bg-slate-50/40 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-2xl space-y-3 text-center">
          <div className="border-brand-200/70 bg-brand-50 text-brand-600 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold tracking-wider uppercase">
            KENALI MODUS, PILIH LANGKAH
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Sedikit wawasan, <span className="text-brand-600">lebih banyak perlindungan.</span>
          </h2>
          <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
            Pilih fitur sesuai bahan yang Anda terima. Unggah file atau gambar milik Anda secara
            manual, atau mulai belajar di Academy.
          </p>
        </div>

        {/* 3 Articles Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {articles.map((article) => (
            <div
              key={article.id}
              className="group flex flex-col justify-between gap-6 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all hover:shadow-md sm:p-7"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${article.tagColor}`}
                  >
                    {article.tag}
                  </span>
                </div>

                <div className="flex size-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition-transform group-hover:scale-105">
                  <article.Icon className="size-5" />
                </div>

                <h3 className="group-hover:text-brand-600 text-lg leading-snug font-bold text-slate-900 transition-colors">
                  {article.title}
                </h3>

                <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
                  {article.excerpt}
                </p>
              </div>

              <Link
                href={article.href}
                className="hover:text-brand-600 inline-flex cursor-pointer items-center gap-1.5 pt-2 text-xs font-bold text-slate-800 transition-colors"
              >
                <span>{article.action}</span>
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
