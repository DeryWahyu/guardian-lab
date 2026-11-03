import { ShieldCheck } from "lucide-react";

export function GuardianSecurityBadge() {
  return (
    <div className="border-brand-200/60 bg-brand-50/70 my-5 flex items-start gap-3 rounded-2xl border p-3.5 text-left">
      <div className="bg-brand-100 text-brand-700 mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl">
        <ShieldCheck className="size-4" />
      </div>
      <div>
        <h4 className="text-brand-900 text-xs font-bold">Zero Real PII &bull; Data Terproteksi</h4>
        <p className="text-brand-800/80 mt-0.5 text-[11px] leading-relaxed">
          Guardian Lab secara otomatis menyensor nomor telepon, NIK, dan token bot sebelum analisis
          diproses.
        </p>
      </div>
    </div>
  );
}
