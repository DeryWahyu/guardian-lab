import { Award, Crown, Flame, Medal } from "lucide-react";
import { formatExp, type RankingEntry } from "./leaderboard-presentation";
import styles from "./leaderboard.module.css";

export function LeaderboardPodium({ items }: { items: RankingEntry[] }) {
  const leaders = items.filter((item) => item.position >= 1 && item.position <= 3);
  if (!leaders.length) return null;
  return (
    <section
      className={styles.highlights}
      aria-labelledby="leaderboard-highlights"
      data-user-reveal
      data-user-order="1"
    >
      <div className={styles.sectionHeading}>
        <div>
          <h2 id="leaderboard-highlights">Langkah yang menginspirasi.</h2>
          <p>Guardian dengan total EXP terbanyak.</p>
        </div>
        <span>
          <Award aria-hidden="true" size={16} />
          Peringkat teratas
        </span>
      </div>
      <ol
        className={styles.podium}
        data-count={leaders.length}
        aria-label="Guardian peringkat teratas"
      >
        {leaders.map((item) => {
          const Icon = item.position === 1 ? Crown : Medal;
          return (
            <li
              key={item.alias}
              className={styles.podiumCard}
              data-position={item.position}
              data-current={item.isCurrentUser}
            >
              <span className={styles.podiumPosition}>
                <Icon aria-hidden="true" size={16} />
                Peringkat {item.position}
              </span>
              <span className={styles.podiumEmblem} aria-hidden="true">
                <Icon size={31} strokeWidth={1.7} />
              </span>
              <p className={styles.podiumAlias}>
                {item.alias}
                {item.isCurrentUser && <span className={styles.you}>Kamu</span>}
              </p>
              <p className={styles.podiumRank}>{item.rank}</p>
              <p className={styles.podiumExp}>
                <strong>{formatExp(item.exp)}</strong>
                <span>EXP</span>
              </p>
              <p className={styles.podiumStreak}>
                <Flame aria-hidden="true" size={14} />
                {item.streakDays} hari berturut-turut
              </p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
