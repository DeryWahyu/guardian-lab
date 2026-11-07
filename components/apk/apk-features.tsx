import { IdCard, Layers, Shield } from "lucide-react";
import styles from "./apk-workspace.module.css";

export function ApkFeatures() {
  return (
    <ul
      className={styles.features}
      aria-label="Tentang Bedah APK"
      data-user-reveal
      data-user-order="1"
    >
      <li>
        <span>
          <IdCard aria-hidden="true" size={23} />
        </span>
        <div>
          <h2>Identitas aplikasi</h2>
          <p>Baca manifest dan detail APK.</p>
        </div>
      </li>
      <li>
        <span>
          <Shield aria-hidden="true" size={23} />
        </span>
        <div>
          <h2>Izin &amp; jejak kode</h2>
          <p>Kenali akses yang diminta.</p>
        </div>
      </li>
      <li>
        <span>
          <Layers aria-hidden="true" size={23} />
        </span>
        <div>
          <h2>Analisis statis</h2>
          <p>APK tidak dipasang atau dijalankan.</p>
        </div>
      </li>
    </ul>
  );
}
