import styles from "./gateway.module.css";

export function GatewaySkeleton() {
  return (
    <section
      aria-label="Memuat form pemeriksaan"
      aria-busy="true"
      className={`${styles.card} animate-pulse motion-reduce:animate-none`}
    >
      <div aria-hidden="true">
        <div className={styles.tabs}>
          {[0, 1, 2].map((item) => (
            <span key={item} className="m-2 rounded-lg bg-slate-200/60" />
          ))}
        </div>
        <div className={styles.urlLabel}>
          <span className="block h-4 w-48 max-w-full rounded bg-slate-200/60" />
        </div>
        <div className={styles.inputBox}>
          <span className="h-3 w-3/5 rounded bg-slate-100" />
        </div>
        <div className={styles.fieldHelp}>
          <span className="block h-4 w-4/5 rounded bg-slate-100" />
        </div>
        <div className={styles.submit} style={{ background: "#e7eee6" }} />
        <div className={styles.modelNotice}>
          <span className="block h-4 w-3/4 rounded bg-slate-100" />
        </div>
        <div className={styles.privacy}>
          <span className="block h-4 w-3/5 rounded bg-slate-100" />
        </div>
      </div>
    </section>
  );
}
