import { ArrowDown, History } from "lucide-react";
import { formatStudyDate, type AcademyProgress } from "./academy-presentation";
import styles from "./academy.module.css";

export function AcademyActivity({ attempts }: { attempts: AcademyProgress["recentAttempts"] }) {
  return (
    <section
      className={styles.activity}
      aria-labelledby="academy-activity-title"
      data-user-reveal
      data-user-order="1"
    >
      <div className={styles.sectionHeading}>
        <div>
          <h2 id="academy-activity-title">Jejak belajarmu</h2>
          <p>Aktivitas belajar terakhir.</p>
        </div>
        <span className={styles.activityIcon}>
          <History aria-hidden="true" size={21} />
        </span>
      </div>
      {!attempts.length ? (
        <div className={styles.activityEmpty}>
          <span>
            <History aria-hidden="true" size={27} />
          </span>
          <h3>Setiap langkah punya cerita.</h3>
          <p>
            Belum ada aktivitas belajar. Selesaikan latihan pertamamu dan lihat progresnya di sini.
          </p>
          <a href="#latihan">
            Pilih latihan <ArrowDown aria-hidden="true" size={15} />
          </a>
        </div>
      ) : (
        <table className={styles.activityTable}>
          <caption className="sr-only">
            Riwayat aktivitas belajar terbaru, tanggal dalam WIB
          </caption>
          <thead>
            <tr>
              <th scope="col">Latihan</th>
              <th scope="col">Nilai</th>
              <th scope="col">EXP</th>
              <th scope="col">Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {attempts.map((attempt) => (
              <tr key={attempt.id}>
                <th scope="row">{attempt.title}</th>
                <td data-label="Nilai">
                  <span>{attempt.score}/100</span>
                </td>
                <td data-label="EXP">
                  <span className={styles.earnedExp}>
                    {attempt.expEarned > 0 ? "+" : ""}
                    {attempt.expEarned} EXP
                  </span>
                </td>
                <td data-label="Tanggal">
                  <time dateTime={attempt.completedAt}>{formatStudyDate(attempt.completedAt)}</time>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
