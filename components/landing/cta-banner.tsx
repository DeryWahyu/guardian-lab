"use client";

import { ArrowUp, Sparkles } from "lucide-react";
import { CyberGuardianMascot } from "@/components/shared/mascot";

export function CtaBanner() {
  const scrollToGateway = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="py-14 sm:py-18">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="from-brand-100/70 shadow-brand-100/30 relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-r via-slate-50 to-slate-100/70 p-8 shadow-lg sm:p-12 lg:p-14">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            {/* Left Content (Spans 8 cols) */}
            <div className="space-y-4 text-center lg:col-span-8 lg:text-left">
              <div className="border-brand-200/60 text-brand-700 inline-flex items-center gap-1.5 rounded-full border bg-white/80 px-3 py-1 text-xs font-bold tracking-wider uppercase">
                <Sparkles className="text-brand-600 size-3" />
                <span>DI SINI UNTUKMU</span>
              </div>

              <h2 className="text-3xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                Mulai saat kamu <span className="text-brand-600">curiga.</span>
              </h2>

              <p className="max-w-xl text-sm leading-relaxed text-slate-700 sm:text-base">
                Tak perlu menunggu hingga rekening terkuras atau data pribadi bocor ke sindikat
                penipu. Uji setiap tautan dan file mencurigakan di lingkungan terisolasi Guardian
                Lab sekarang.
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={scrollToGateway}
                  className="bg-brand-600 shadow-brand-200 hover:bg-brand-700 inline-flex cursor-pointer items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95 sm:text-base"
                >
                  <span>Mulai Analisis Sekarang</span>
                  <ArrowUp className="size-4" />
                </button>
              </div>
            </div>

            {/* Right Graphic: Mascot (Spans 4 cols) */}
            <div className="flex justify-center lg:col-span-4 lg:justify-end">
              <CyberGuardianMascot pose="cta" className="max-w-[200px] sm:max-w-[240px]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
