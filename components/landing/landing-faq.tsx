import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./community.module.css";
import shared from "./landing.module.css";

const questions = [
  {
    question: "Apakah tautan langsung dibuka di perangkat saya?",
    answer:
      "Tidak. Mengirim tautan atau gambar QR tidak membuka situsnya di perangkatmu. Jika kamu memilih sandbox, situs dibuka melalui browser terisolasi di server.",
  },
  {
    question: "Apakah file APK akan dipasang?",
    answer:
      "Tidak. APK diperiksa secara statis untuk membaca izin dan temuan yang tersedia, tanpa memasang atau menjalankan aplikasinya di perangkatmu.",
  },
  {
    question: "Kapan saya perlu masuk ke akun?",
    answer:
      "Kamu bisa mengenal fitur di halaman ini tanpa akun. Untuk mengirim pemeriksaan dan mengakses fitur, masuk dengan akun yang nomor WhatsApp-nya sudah diverifikasi.",
  },
  {
    question: "Kapan saya bisa membuat Share Card?",
    answer:
      "Share Card dapat dibuat dari hasil analisis yang sudah lengkap. Hasil yang masih diproses atau belum lengkap belum dapat dibagikan sebagai Share Card.",
  },
];

export function LandingFaq() {
  return (
    <section aria-labelledby="landing-faq-title" className={styles.faq}>
      <h3 id="landing-faq-title" className={cn(shared.display, styles.faqTitle)}>
        Sebelum mulai, mungkin kamu penasaran.
      </h3>
      <div className={styles.questions}>
        {questions.map(({ question, answer }) => (
          <details key={question}>
            <summary>
              {question}
              <Plus aria-hidden="true" />
            </summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
