import { Flame, ShieldCheck } from "lucide-react";
import { formatExp, type RankingEntry } from "./leaderboard-presentation";
import styles from "./leaderboard.module.css";

export function RankingList({ items }: { items: RankingEntry[] }) {
  return (
    <ol
      className={styles.rankingList}
      start={items[0]?.position ?? 1}
      aria-label="Daftar peringkat Guardian"
    >
      {items.map((item) => (
        <li key={item.alias} className={styles.rankingRow} data-current={item.isCurrentUser}>
          <span className={styles.position} data-top={item.position <= 3}>
            <span className="sr-only">Peringkat </span>
            {item.position}
          </span>
          <div className={styles.identity}>
            <span className={styles.avatar} aria-hidden="true">
              <ShieldCheck size={23} strokeWidth={1.7} />
            </span>
            <div>
              <p className={styles.alias}>
                {item.alias}
                {item.isCurrentUser && <span className={styles.you}>Kamu</span>}
              </p>
              <p className={styles.meta}>
                <span>{item.rank}</span>
                <span aria-hidden="true">&middot;</span>
                <span>
                  <Flame aria-hidden="true" size={13} />
                  {item.streakDays} hari berturut-turut
                </span>
              </p>
            </div>
          </div>
          <p className={styles.exp}>
            <strong>{formatExp(item.exp)}</strong>
            <span>EXP</span>
          </p>
        </li>
      ))}
    </ol>
  );
}
