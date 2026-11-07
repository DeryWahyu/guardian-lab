import { Clock3, PanelsTopLeft, Trash2 } from "lucide-react";
import styles from "./web-sandbox.module.css";

export function SandboxFeatures() {
  return (
    <ul
      className={styles.features}
      aria-label="Tentang Ruang Uji"
      data-user-reveal
      data-user-order="1"
    >
      <li>
        <span>
          <PanelsTopLeft aria-hidden="true" size={23} />
        </span>
        <div>
          <h2>Browser terisolasi</h2>
          <p>Tautan dibuka di server.</p>
        </div>
      </li>
      <li>
        <span>
          <Clock3 aria-hidden="true" size={24} />
        </span>
        <div>
          <h2>180 detik per sesi</h2>
          <p>Sesi berhenti otomatis.</p>
        </div>
      </li>
      <li>
        <span>
          <Trash2 aria-hidden="true" size={23} />
        </span>
        <div>
          <h2>Data sementara dihapus</h2>
          <p>Setelah sesi berakhir.</p>
        </div>
      </li>
    </ul>
  );
}
