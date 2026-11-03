import { Info } from "lucide-react";
import styles from "./gateway.module.css";

export function GatewayPrivacyControl() {
  return (
    <details className={styles.privacy}>
      <summary>
        <Info aria-hidden="true" />
        Jangan sertakan kata sandi atau OTP.
      </summary>
      <p className={styles.privacyText}>
        Data pribadi pada target disamarkan sebelum disimpan. Masuk ke akun untuk menyimpan dan
        melihat kembali investigasimu.
      </p>
    </details>
  );
}
