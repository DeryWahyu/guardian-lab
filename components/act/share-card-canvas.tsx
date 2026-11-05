import { TriangleAlert } from "lucide-react";
import type { RefObject } from "react";
import { BrandIdentity } from "@/components/shared/brand-identity";
import type { ShareCardData } from "@/lib/share-card/content";
import { cn } from "@/lib/utils";

export function ShareCardCanvas({
  card,
  cardRef,
}: {
  card: ShareCardData;
  cardRef?: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={cardRef}
      data-share-card
      className="w-full space-y-5 overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 [font-family:Arial,sans-serif] text-[14px] leading-relaxed text-slate-800"
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <BrandIdentity
          subtitle={null}
          markClassName="size-7"
          wordmarkClassName="text-sm font-bold tracking-normal"
        />
        <span className="text-[12px] text-slate-500">Pemeriksaan {card.type}</span>
      </header>
      <div className={cn("space-y-2 rounded-xl p-4", card.risk.background)}>
        <div className={cn("flex items-start gap-2 font-semibold", card.risk.color)}>
          {!card.risk.low && (
            <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          )}
          <span>{card.risk.label}</span>
        </div>
        <h2 className="text-[26px] leading-tight font-bold text-slate-900">{card.title}</h2>
        <p className="text-[13px]">
          {card.scoreLabel}: <strong>{card.riskScore}/100</strong>
        </p>
      </div>
      <div>
        <p className="text-[12px] font-semibold text-slate-500">
          {card.type === "APK" ? "Nama berkas APK" : "Target dinonaktifkan (defanged)"}
        </p>
        <p className="mt-1 rounded-lg bg-slate-100 p-3 [font-family:monospace] text-[13px] [overflow-wrap:anywhere]">
          {card.target}
        </p>
      </div>
      <div className="space-y-2 [overflow-wrap:anywhere]">
        <p className="font-bold">{card.category}</p>
        <p>{card.summary}</p>
        {card.findings.length > 0 && (
          <ul className="list-disc space-y-1 pl-5">
            {card.findings.map((finding, i) => (
              <li key={`${i}-${finding}`}>{finding}</li>
            ))}
          </ul>
        )}
      </div>
      <footer className="space-y-2 border-t border-slate-200 pt-4 text-[11px] leading-relaxed [overflow-wrap:anywhere] text-slate-500">
        {card.notice && (
          <p>{card.notice} Model riset nonkomersial, masih dikembangkan.</p>
        )}
        {card.truncated && <p>Ringkasan dipersingkat dari hasil tersimpan.</p>}
        <p>Hasil pemeriksaan menggambarkan saat analisis, bukan jaminan keamanan.</p>
        <p>
          Sumber: {card.source} · Model: {card.version}
        </p>
        <p>
          {card.date}
          <br />
          ID: {card.id}
        </p>
      </footer>
    </div>
  );
}
