import { Clipboard, Link2, Loader2 } from "lucide-react";
import type { RefObject } from "react";
import { MAX_URL_LENGTH } from "@/lib/validations/analysis-input";
import styles from "./gateway.module.css";

export function GatewayUrlField({
  inputRef,
  value,
  error,
  disabled,
  pasting,
  onChange,
  onPaste,
}: {
  inputRef: RefObject<HTMLInputElement | null>;
  value: string;
  error: string | null;
  disabled: boolean;
  pasting: boolean;
  onChange: (value: string) => void;
  onPaste: () => void;
}) {
  return (
    <>
      <label htmlFor="url-target-input" className={styles.urlLabel}>
        Alamat tautan <span className="sr-only">(wajib)</span>
      </label>
      <div className={styles.inputBox} data-invalid={Boolean(error)}>
        <Link2 aria-hidden="true" className={styles.linkIcon} />
        <input
          ref={inputRef}
          id="url-target-input"
          type="text"
          inputMode="url"
          autoCapitalize="none"
          autoComplete="off"
          spellCheck={false}
          required
          disabled={disabled || pasting}
          maxLength={MAX_URL_LENGTH}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "url-help url-error" : "url-help"}
          placeholder="https://contoh.com"
          className={styles.urlInput}
        />
        <button
          type="button"
          onClick={onPaste}
          disabled={disabled || pasting}
          className={styles.paste}
        >
          {pasting ? (
            <Loader2 aria-hidden="true" className="animate-spin motion-reduce:animate-none" />
          ) : (
            <Clipboard aria-hidden="true" />
          )}
          {pasting ? "Menempel…" : "Tempel"}
        </button>
      </div>
      <p id="url-help" className={styles.fieldHelp}>
        Tautan dicatat tanpa membuka situs di perangkatmu.
        <span className="sr-only">
          {" "}
          Tautan tanpa protokol menggunakan HTTPS. Maksimal 16.384 karakter.
        </span>
      </p>
      {error && (
        <p id="url-error" role="alert" className="mt-2 text-sm text-rose-700">
          {error}
        </p>
      )}
    </>
  );
}
