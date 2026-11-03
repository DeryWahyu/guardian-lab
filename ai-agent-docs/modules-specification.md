# Spesifikasi Detail Modul Aplikasi — Guardian Lab

> **Dokumen:** `ai-agent-docs/modules-specification.md`  
> **Fokus Utama:** Spesifikasi Lengkap Modul Fitur, RBAC (Admin & User), Proteksi Riwayat Forensik, Gamifikasi Kuis Edukasi (Duolingo Style), dan Community Forensic Replay  
> **Audience:** AI Coding Agent & Pengembang Fullstack Next.js

---

Fondasi rekaman investigasi, persistensi ID/pemilik/status, riwayat, dan perilaku saat model belum tersedia telah diimplementasikan. Rujuk [investigations.md](./investigations.md) untuk alur aktif. Deteksi model dan ekstraksi statis APK masih merupakan pekerjaan lanjutan.

> [!IMPORTANT]
> **Aturan Redundansi & Siklus Hidup Dokumen Spesifikasi:**
> Begitu suatu fitur atau sub-modul di bawah ini telah selesai diimplementasikan ke dalam kode (lengkap dengan UI, logika, skema Zod, dan pengujian `bun test`-nya), **HAPUS entri fitur tersebut dari dokumen ini**.
> Hal ini bertujuan agar kode repositori menjadi _single source of truth_, mencegah redundansi, dan menjaga dokumen ini tetap fokus sebagai _backlog_ fitur yang belum diimplementasikan.

---

Input gateway URL/QR/APK, autentikasi input, validasi, drag-and-drop, serta kontrol privasi telah tersedia. Kontrak aktif dan batas implementasi dirujuk di [input-flow.md](./input-flow.md).

## 2. Modul 2: Deteksi AI URL & QR Decoder Helper (`/api/analyze-url` & `/api/analyze-qr`)

- **Tujuan:** Melakukan inspeksi leksikal tautan serta membantu mengekstrak string/URL dari gambar kode QR secara instan.
- **Akses Pengguna:** **Khusus User Terautentikasi (`USER` & `ADMIN`)**.
- **Fitur Utama:**
  1. **Model AI Deteksi Phishing URL:**
     - Ekstraksi fitur leksikal: panjang URL, rasio karakter khusus, Shannon entropy, TLD berisiko tinggi (`.xyz`, `.top`, `.click`, `.buzz`), dan kemiripan nama bank/brand Indonesia (_typosquatting_ seperti `bca-klik[.]xyz`).
     - Output skor risiko (0–100) dan _Explainable Red Flags_.

Decoder QR, provenance input, dan penyimpanan investigasi telah tersedia; lihat [investigations.md](./investigations.md). Bagian yang masih menunggu adalah integrasi model untuk menghasilkan penilaian risiko.

---

## 3. Modul 3: Sandbox Web Nyata (/sandbox/web)

- USER/ADMIN memasukkan URL publik atau melanjutkan tautan dari hasil/riwayat, lalu menekan tombol mulai.
- Chromium/KasmVNC, proxy egress, dan jaringan sesi dialokasikan melalui broker terpisah. Next tidak memegang socket Docker.
- Stream HTTP/WebSocket hanya terbuka dengan tiket sesi. Maksimal 180 detik, satu sesi per akun, dan tiga sesi global.
- Runtime offline menghasilkan status tidak tersedia tanpa sesi aktif palsu. Penghentian/pembersihan harus dikonfirmasi provider.
- Unduhan hanya di server: APK dikarantina dan dapat dikirim manual ke bedah statis/riwayat. Clipboard, perangkat, dan transfer lokal diblokir. Viewport mobile dan thumbnail sesi belum tersedia.
- Kontrak, keamanan jaringan, batas runtime, dan verifikasi: [sandbox-and-academy.md](./sandbox-and-academy.md).

---

## 4. Modul 4: APK X-Ray Reverse Engineering & Emulator (`/api/analyze-apk` & `/sandbox/android`)

- **Tujuan:** Membedah file `.apk` secara statis dan menyediakan HP virtual interaktif untuk pengujian dinamis.
- **Akses Pengguna:** **Khusus User Terautentikasi (`USER` & `ADMIN`)**.
- **Fitur Utama:**
  1. **Jalur Cepat (Static X-Ray via DeepSeek LLM):**
     - Tahap 7 memakai JADX terverifikasi untuk manifest biner/resource, permissions, dan dekompilasi DEX dalam proses berbatas sumber daya.
     - Scanner menyimpan origin alamat nonaktif, jumlah/fingerprint indikator bot, serta potongan Java tersanitasi. Token/kontak/konstanta sensitif dan path/query rahasia tidak disimpan.
     - Fakta statis ditampilkan dalam mode manusia/teknis. Model/DeepSeek belum dipanggil, skor risiko tetap kosong. Kontrak aktif dan setup: [apk-static.md](./apk-static.md).
  2. **Jalur Interaktif (Android Emulator Sandbox):**
     - Belum aktif: runtime lokal tidak menyediakan binder untuk Redroid. Halaman menampilkan batas ini dan tautan ke bedah APK statis; tidak membuat sesi atau emulator simulasi.
  3. **Penyimpanan Riwayat Dekompilasi Lengkap:**
     - Metadata manifest, daftar izin Android berbahaya, temuan bot Telegram, dan respon AI tersimpan di riwayat pengguna.

---

## 5. Modul 5: Pilar Act — Guardian Share Card (`/act`)

- **Tujuan:** Generator infografis peringatan WhatsApp 1-klik untuk perlindungan keluarga dan komunitas.
- **Akses Pengguna:** **Khusus User Terautentikasi (`USER` & `ADMIN`)**.
- **Fitur Utama:**
  1. **Guardian Share Card Generator:**
     - Membaca hasil lengkap tersimpan berdasarkan ID, dengan akses pemilik/admin.
     - Target dan indikator di dalam ringkasan dinonaktifkan; PII dan kredensial disamarkan.
     - Memuat ringkasan serta maksimal tiga temuan nyata, skor/verdict, sumber model, waktu hasil, dan ID.
     - SAFE/LOW menggunakan kartu netral. Hasil belum tersedia/gagal/legacy tidak dapat diekspor.
     - Unduh PNG via `html-to-image`, salin pesan dengan fallback manual, serta berbagi file bila browser mendukung.
     - Kontrak dan batas implementasi: [share-card.md](./share-card.md).
  2. **Kontribusi ke Komunitas (Tahap 6):**
     - Pengajuan dari ID investigasi lengkap tersedia melalui preview dan persetujuan pengguna; rujuk [community.md](./community.md).

---

## 6. Modul 6: Backlog Administrasi Lanjutan

Autentikasi, sesi, pembatasan peran, landing USER, dan dashboard ADMIN telah diimplementasikan. Kontrak yang berlaku dan lokasi kode tersedia di [authentication.md](./authentication.md).

- UI manajemen daftar pengguna dan pemberian peran melalui proses admin yang terkontrol.
- Audit log aktivitas administrasi dan pengaturan website lanjutan.

---

## 7. Tindak Lanjut dari Riwayat

Daftar/detail, metadata hasil, mode manusia/teknis, filter tanggal, dan pagination telah diimplementasikan; rujuk [results-and-history.md](./results-and-history.md).

- Ekspor Guardian Share Card dari hasil tersimpan tersedia; rujuk [share-card.md](./share-card.md).
- Kontribusi investigasi dan moderasi admin sudah terhubung ke snapshot hasil tersimpan; rujuk [community.md](./community.md).

---

## 8. Modul 8: Guardian Academy (/academy dan /admin/quizzes)

- Daftar kuis, EXP, peringkat, streak WIB, lencana, dan 10 latihan terakhir berasal dari akun aktif di MySQL.
- Soal tunggal, jamak, dan benar/salah dinilai server. Kunci/pembahasan tidak disertakan pada API publik sebelum pengiriman jawaban.
- Lulus minimal 70%. EXP hanya diberikan pada kelulusan pertama per kuis; gagal/ulang mendapat nol EXP. Transaksi dan UUID pengiriman mencegah hadiah ganda.
- CMS menyediakan editor materi dan soal lengkap, draf/terbit, revisi untuk konflik edit, pagination 10 kuis, dan pengarsipan yang mempertahankan progres pengguna.
- Lencana Langkah Pertama diberikan setelah satu kelulusan; tidak ada lencana contoh yang dibuka otomatis. Skill tree terkunci bertahap dan soal gambar belum tersedia.
- Tiga materi awal ditambahkan secara idempoten dengan bun run academy:seed, tanpa akun demo atau penimpaan konten admin.
- Kontrak, migrasi, dan verifikasi: [sandbox-and-academy.md](./sandbox-and-academy.md).

---

## 9. Modul 9: Community Forensic Replay (`/community` & `/admin/community-reviews`)

- **Tujuan:** Mengubah temuan ancaman nyata dari investigasi pengguna lain menjadi studi kasus interaktif yang dapat dimainkan dan dipelajari oleh seluruh komunitas.
- **Akses Pengguna:** `USER` (Pemain Investigasi Komunitas), `ADMIN` (Moderator Validasi).
- **Fitur Utama:**
  1. **Alur Pengajuan Kasus Komunitas:**
     - Pengguna memilih **Ajukan ke komunitas** dari hasil lengkap/Share Card, meninjau snapshot, dan memberikan persetujuan.
     - API hanya menerima ID investigasi milik pengguna dan consent; snapshot disanitasi serta duplikasi dicegah dengan relasi unik.
  2. **Panel Moderasi Admin (`/admin/community-reviews`):**
     - Admin memeriksa snapshot, mengonfirmasi privasi untuk publikasi atau menuliskan alasan penolakan. Satu keputusan akhir dicatat dengan reviewer/waktu; pengajuan sendiri memerlukan admin lain.
  3. **Detail Kasus (`/community/[replayId]`):**
     - Anggota membaca snapshot kasus yang disetujui dalam mode manusia/teknis, tanpa identitas pengaju atau bukti mentah sensitif.
     - Pending/ditolak hanya tersedia bagi pemilik/admin. Filter dan pagination tersedia pada daftar komunitas/antrean.
     - Latihan tiga soal dari snapshot memberi 30 EXP hanya pada kelulusan pertama; pembacaan kasus tidak memberi EXP. Leaderboard memakai EXP aktual dan alias anonim.
     - Kontrak API, migrasi, dan batas implementasi: [community.md](./community.md).
