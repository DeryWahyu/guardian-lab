import type { z } from "zod";
import workspace from "@/components/workspace/workspace.module.css";
import type { rankingEntrySchema } from "@/lib/validations/platform";
export function RankingList({ items }: { items: z.infer<typeof rankingEntrySchema>[] }) {
  return (
    <ol className="divide-y divide-slate-200">
      {items.map((item) => (
        <li key={item.alias} className={workspace.rankingRow} data-current={item.isCurrentUser}>
          <div className="flex items-center gap-3">
            <span className={workspace.rankNumber} data-top={item.position <= 3}>
              {item.position}
            </span>
            <div>
              <p className="font-semibold">
                {item.alias}
                {item.isCurrentUser ? " (kamu)" : ""}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {item.rank} · {item.streakDays} hari belajar
              </p>
            </div>
          </div>
          <span className="text-brand-700 font-semibold tabular-nums">
            {item.exp.toLocaleString("id-ID")} EXP
          </span>
        </li>
      ))}
    </ol>
  );
}
