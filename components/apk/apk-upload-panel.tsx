import { Info, Loader2, Search } from "lucide-react";
import { InvestigationRequestFeedback } from "@/components/shared/investigation-request-feedback";
import { ApkUploadField } from "./apk-upload-field";
import styles from "./apk-workspace.module.css";

export function ApkUploadPanel({
  file,
  error,
  requestError,
  uncertain,
  pending,
  onSelect,
  onClear,
  onSubmit,
}: {
  file: File | null;
  error: string | null;
  requestError: string | null;
  uncertain: boolean;
  pending: boolean;
  onSelect: (files: File[]) => void;
  onClear: () => void;
  onSubmit: () => void;
}) {
  return (
    <form
      noValidate
      aria-label="Pemeriksaan file APK"
      aria-busy={pending}
      className={styles.uploadPanel}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <h2>Mulai pemeriksaan</h2>
      <ApkUploadField
        file={file}
        error={error}
        disabled={pending}
        onSelect={onSelect}
        onClear={onClear}
      />
      <InvestigationRequestFeedback error={requestError} uncertain={uncertain} />
      <button type="submit" disabled={pending || !file} className={styles.submitButton}>
        {pending ? (
          <Loader2
            aria-hidden="true"
            size={17}
            className="animate-spin motion-reduce:animate-none"
          />
        ) : (
          <Search aria-hidden="true" size={17} />
        )}
        {pending ? "Memeriksa APK..." : "Periksa APK"}
      </button>
      <div className={styles.modelNotice}>
        <Info aria-hidden="true" size={17} />
        <p>
          <strong>AI sedang disiapkan.</strong> Skor risiko belum tersedia.
          <br />
          Temuan statis yang berhasil diekstrak tetap ditampilkan.
        </p>
      </div>
      <div className={styles.privacy}>
        <p>
          <Info aria-hidden="true" size={16} /> Jangan unggah berkas berisi data pribadi.
        </p>
      </div>
      {pending && (
        <output className={styles.pendingNotice}>
          Proses dapat memerlukan waktu hingga sekitar satu menit. Tunggu hingga selesai dan jangan
          kirim ulang.
        </output>
      )}
    </form>
  );
}
