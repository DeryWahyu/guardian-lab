"use client";

import { Tabs } from "@base-ui/react/tabs";
import { Code2, FileText, Info, Link2, MessageCircle } from "lucide-react";
import { BrandMark } from "@/components/shared/brand-identity";
import styles from "./result-preview-report.module.css";

const scopeDetails = [
  { label: "Cakupan analisis", value: "Pola alamat URL" },
  { label: "Isi halaman", value: "Tidak diperiksa" },
  { label: "Pengalihan (redirect)", value: "Tidak diikuti" },
  { label: "Verifikasi lanjutan", value: "Tetap diperlukan" },
];

export function ResultPreviewReport() {
  return (
    <figure className={styles.report} aria-labelledby="preview-report-caption">
      <figcaption id="preview-report-caption" className={styles.header}>
        <span className={styles.identity}>
          <BrandMark alt="" className={styles.brandMark} />
          <span>
            <strong>Guardian Lab</strong>
            <span>Hasil pemeriksaan</span>
          </span>
        </span>
        <span className={styles.exampleBadge}>Contoh tampilan</span>
      </figcaption>
      <div className={styles.target}>
        <Link2 aria-hidden="true" />
        <div>
          <span>Tautan ilustrasi</span>
          <p>hxxps://contoh[.]invalid/tautan</p>
        </div>
      </div>
      <Tabs.Root defaultValue="human">
        <Tabs.List aria-label="Mode pratinjau hasil" className={styles.tabs} activateOnFocus>
          <Tabs.Tab value="human" className={styles.tab}>
            <MessageCircle aria-hidden="true" />
            Bahasa Manusia
          </Tabs.Tab>
          <Tabs.Tab value="geek" className={styles.tab}>
            <Code2 aria-hidden="true" />
            Teknis
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="human" className={styles.panel}>
          <div className={styles.panelHeading}>
            <span className={styles.panelIcon}>
              <FileText aria-hidden="true" />
            </span>
            <div>
              <h3>Ringkasan pemeriksaan</h3>
              <p>Penjelasan dalam bahasa sederhana.</p>
            </div>
          </div>
          <p className={styles.summary}>
            Model membaca pola alamat. Skor rendah belum menjamin aman; tetap verifikasi sebelum
            membuka tautan atau memasukkan data.
          </p>
          <dl className={styles.facts}>
            <div>
              <dt>Yang diperiksa</dt>
              <dd>Pola alamat URL</dd>
            </div>
            <div>
              <dt>Yang belum diperiksa</dt>
              <dd>Isi halaman dan redirect</dd>
            </div>
          </dl>
        </Tabs.Panel>
        <Tabs.Panel value="geek" className={styles.panel}>
          <div className={styles.panelHeading}>
            <span className={styles.panelIcon}>
              <Code2 aria-hidden="true" />
            </span>
            <div>
              <h3>Rincian pemeriksaan</h3>
              <p>Cakupan dan batas model URL.</p>
            </div>
          </div>
          <dl className={styles.metadata}>
            {scopeDetails.map(({ label, value }) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </Tabs.Panel>
      </Tabs.Root>
      <div className={styles.reviewNote}>
        <Info aria-hidden="true" />
        <p>Indikator riset. Hasil tetap perlu diverifikasi.</p>
      </div>
      <p className={styles.footnote}>Ilustrasi antarmuka, bukan hasil analisis tautan.</p>
    </figure>
  );
}
