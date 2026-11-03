export function MilestoneFlowSection() {
  const steps = [
    {
      title: "Masukkan tautan, QR, atau APK",
      description:
        "Masuk lalu gunakan input manual. QR membantu mengubah gambar menjadi teks atau URL; APK dibaca secara statis.",
    },
    {
      title: "Baca hasil dan statusnya",
      description:
        "Hasil tersimpan pada satu ID investigasi. Saat model belum tersedia, skor risiko tidak dibuat-buat. Fakta statis APK tetap dapat dipelajari.",
    },
    {
      title: "Gunakan sandbox jika perlu",
      description:
        "Buka tautan pada browser server. APK yang selesai diunduh masuk karantina dan dapat dibedah tanpa dipindahkan ke perangkatmu.",
    },
    {
      title: "Bertindak berdasarkan bukti",
      description:
        "Dari hasil lengkap, buat Share Card atau ajukan kasus untuk moderasi. Pelajari kasus yang disetujui dan lanjutkan latihan di Academy.",
    },
  ];
  return (
    <section className="border-y border-slate-200 bg-slate-50 py-14 sm:py-20">
      <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl space-y-3">
          <h2 className="text-3xl font-semibold text-slate-900">
            Dari rasa curiga ke keputusan yang lebih jelas
          </h2>
          <p className="text-sm leading-relaxed text-slate-600">
            Pilih langkah yang sesuai kebutuhanmu. Membuka sandbox tidak menggantikan hasil
            analisis, dan membaca kasus tidak otomatis memberi EXP.
          </p>
        </div>
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title} className="border-brand-200 space-y-3 border-l-2 pl-5">
              <p className="text-brand-700 text-sm font-semibold">Langkah {index + 1}</p>
              <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
              <p className="text-sm leading-relaxed text-slate-600">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
