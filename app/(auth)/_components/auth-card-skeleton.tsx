import { cn } from "@/lib/utils";
import styles from "../auth.module.css";

export function AuthCardSkeleton({
  title = "Menyiapkan halaman…",
  fields = 2,
}: {
  title?: string;
  fields?: number;
}) {
  return (
    <section
      role="status"
      aria-label={title}
      aria-busy="true"
      className="animate-pulse motion-reduce:animate-none"
    >
      <div aria-hidden="true">
        <div className={styles.skeletonHeading} data-lines={fields === 2 ? 2 : 1} />
        <div className={styles.skeletonSubtitle} />
        <div className={cn(styles.form, fields === 5 && styles.registration)}>
          {Array.from({ length: fields }, (_, index) => (
            <div key={`field-${index}`} className={styles.field}>
              <div className={styles.skeletonLabel} />
              <div className={styles.skeletonInput} />
            </div>
          ))}
          {fields === 0 && <div className={styles.skeletonNote} />}
          {fields === 2 && <div className={styles.skeletonActions} />}
          <div className={styles.skeletonSubmit} />
        </div>
        <div className={styles.skeletonPrompt} />
      </div>
      <span className="sr-only">{title}</span>
    </section>
  );
}
