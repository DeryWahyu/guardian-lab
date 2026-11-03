import Link from "next/link";
import { PROTECTED_ROUTES } from "@/lib/routes";

const exampleRanking = [
  { position: 1, name: "Dery Wahyu Perdana", exp: 1250 },
  { position: 2, name: "Alfian Gading Saputra", exp: 1100 },
  { position: 3, name: "Rafli Maulana", exp: 950 },
] as const;

export function LearningLeaderboard() {
  return (
    <section
      aria-labelledby="landing-ranking-title"
      className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 id="landing-ranking-title" className="text-xl font-semibold text-slate-900">
          Peringkat belajar
        </h3>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          Data contoh
        </span>
      </div>
      <p className="text-sm leading-relaxed text-slate-600">
        Selesaikan latihan, kumpulkan EXP, dan naik peringkat.
      </p>
      <ol aria-label="Peringkat belajar contoh" className="divide-y divide-slate-100">
        {exampleRanking.map((item) => (
          <li
            key={item.position}
            className="grid grid-cols-[2rem_minmax(0,1fr)] items-center gap-x-3 gap-y-1 py-4 sm:grid-cols-[2rem_minmax(0,1fr)_auto]"
          >
            <span
              className={`row-span-2 flex size-8 items-center justify-center rounded-full text-sm font-semibold tabular-nums sm:row-span-1 ${
                item.position === 1 ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600"
              }`}
            >
              {item.position}
            </span>
            <span className="min-w-0 text-sm font-semibold text-slate-900">{item.name}</span>
            <span className="text-brand-700 col-start-2 text-xs font-semibold tabular-nums sm:col-start-3 sm:text-sm">
              {item.exp.toLocaleString("id-ID")} EXP
            </span>
          </li>
        ))}
      </ol>
      <p className="text-xs leading-relaxed text-slate-500">
        Nama dan EXP di atas merupakan data contoh.
      </p>
      <Link
        href={PROTECTED_ROUTES.academy}
        className="text-brand-700 focus-visible:ring-brand-600 inline-flex min-h-11 items-center rounded-lg font-semibold underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:outline-none"
      >
        Mulai belajar
      </Link>
    </section>
  );
}
