# Redesign Hero Sederhana dan Container Selaras — 3 November 2026

Permintaan terbaru pengguna: desain ulang seluruh hero agar sederhana, elegan, tanpa elemen berulang; gunakan maskot asli dan samakan batas kiri–kanan dengan bagian lainnya. Detail: [hero-reference.md](ai-agent-docs/hero-reference.md).

- Judul ringkas, warna navy/teal, maskot asli `public/brand/guardian-lab-fox.webp`, dan form putih dengan label serta petunjuk tiap input. Dekorasi dan tombol contoh dihapus. Status AI belum tersedia terlihat langsung.
- Container mengikuti header dan bagian landing: maksimal 1280 px dengan padding responsif 16/24/32 px. Form maksimal 600 px; judul desktop 44 px; maskot maksimal 280 px, 88/120 px pada ponsel.
- **22 skenario browser produksi Chrome lulus**, 0 gagal dan 0 unhandled page error. Layout 320–1440 px tidak meluber; keselarasan container diuji pada delapan lebar sampai 1920 px.
- Clipboard, deep link/back/forward, keyboard/fokus, validasi, autentikasi, QR asli, APK statis asli, hasil tersimpan/reload, dan sesi kedaluwarsa lulus dengan database audit terpisah.
- **459 tes Bun lulus**, 0 gagal, 34 file, 2586 assertion. TypeScript, Biome, formatter file tugas, dan build produksi lulus.
- Screenshot serta hasil browser terbaru: `test-results/hero-minimal/`. Integrasi model AI tetap menunggu model hasil pelatihan.

# Arsip Penyesuaian Skala Hero dan Logo Jaket — 3 November 2026

Permintaan lanjutan pengguna: hero diperkecil agar selaras dengan bagian bawah landing, dan jaket maskot memakai logo sistem yang benar. Detail: [hero-reference.md](ai-agent-docs/hero-reference.md).

- Pada desktop 1440 px: tinggi hero **870 → 600 px**, judul **63,6 → 43,68 px**, maskot **500 → 340 px**, serta lebar form **804 → 600 px**. Deskripsi 16 px dan teks kontrol 14 px mengikuti skala halaman. Kontrol utama tetap setinggi 44 px.
- Maskot aktif memakai `public/brand/guardian-lab-fox-hero-koneksi.webp`, dengan logo Koneksi navy/teal pada patch putih. Master dan prompt: [catatan edit logo](design/guardian-lab-fox-hero-koneksi-prompt.md).
- **22 skenario browser produksi Chrome lulus**, 0 gagal dan 0 unhandled page error. Layout 320/390/640/768/837/1024/1440 px tidak meluber, teks balon tidak terpotong, dan ilustrasi tidak menghalangi kontrol.
- Aset yang tampil dan file publik diverifikasi. Clipboard, contoh URL, tab/back-forward, keyboard/fokus, validasi, dialog login, unggahan QR/APK, serta hasil tersimpan tetap berfungsi melalui API nyata pada database audit terpisah.
- **459 tes Bun lulus**, 0 gagal, 34 file, 2586 assertion. TypeScript, Biome, formatter file tugas, dan build produksi lulus.

Pratinjau produksi dan hasil uji berada di `test-results/hero-compact/`. Server serta database audit sudah dibersihkan; server pengembangan pengguna dipertahankan. Bagian selanjutnya adalah arsip verifikasi sebelumnya.

---

# Redesign Hero Mengikuti Referensi — 3 November 2026

Hero mengikuti gambar pengguna: judul dua baris, badge limau, balon percakapan, maskot transparan yang bertumpuk dengan form, tab Tautan/Kode QR/File APK, tombol Tempel, dan chip contoh. Komposisi, batas fitur, aset/prompt, dan perbaikan klik validasi dijelaskan di [hero-reference.md](ai-agent-docs/hero-reference.md).

- **21 skenario browser produksi Chrome lulus**, 0 gagal dan 0 unhandled page error. Lebar 320/390/640/768/837/1024/1440 px tidak memiliki overflow horizontal.
- Layout 837 px dibandingkan dengan referensi; kartu berada sekitar x=37, y=287 dengan lebar 561 px. Ilustrasi tidak menghalangi target input/tombol.
- Clipboard nyata serta kondisi kosong/ditolak/timeout lulus. Chip contoh hanya mengisi URL fiktif, tanpa membuka situs, auto-submit, atau hasil buatan.
- Tab/deep-link/back-forward, keyboard/fokus, validasi, dialog login, privasi target, pratinjau/hapus/drop QR, serta validasi berkas APK lulus.
- Pengguna masuk mengirim URL, QR gambar nyata, dan APK fixture jinak melalui API sebenarnya pada MySQL audit terpisah. Decode QR, ekstraksi statis APK, ID hasil/reload, serta sesi yang berakhir tetap berfungsi. Model AI tetap belum dihubungkan.
- **459 tes Bun lulus**, 0 gagal, 34 file, 2586 assertion. TypeScript, Biome, formatter file tugas, dan build produksi lulus.
- Aset hero transparan memakai `public/brand/guardian-lab-fox-hero-v2.webp` (146.222 byte), dengan master dan prompt pada `design/`. Placeholder loading mengikuti susunan kartu.

Screenshot dan hasil pengujian: `test-results/hero-reference/`. Server audit dan database sementara sudah dibersihkan; server pengembangan pengguna dipertahankan. Bagian berikut merupakan hasil audit sebelumnya.

---

# Audit Alur Sistem — 3 November 2026

Alur aplikasi diperiksa saat model AI masih dilatih oleh tim. Integrasi AI yang sempat dimulai dibatalkan. Rincian alur, enam perbaikan bug, dan batas kemampuan aktif: [system-flow-audit.md](ai-agent-docs/system-flow-audit.md).

- **459 tes Bun lulus**, 0 gagal, 34 file, 2586 assertion, menggunakan MySQL sementara.
- **24 skenario browser produksi Chrome lulus**, 0 gagal, 0 unhandled page error. Cakupan: tamu/USER/ADMIN, login/logout, URL, gambar QR nyata, ekstraksi APK nyata, konsistensi ID riwayat, akses pemilik, hasil Manusia/Geek, ekspor PNG, pengajuan/moderasi komunitas, Academy dan EXP, sandbox Docker melalui UI, Android belum tersedia, serta layout 320/390/768/1440 px.
- **Dua regresi browser lulus setelah perbaikan**: pemulihan GET setelah timeout ketika fokus kembali, serta target sandbox yang mengikuti navigasi URL. Keduanya gagal pada reproduksi sebelum perbaikan.
- TypeScript, Biome, formatter file audit, dan build produksi lulus.
- Verifikasi Docker nyata untuk stream HTTP/WebSocket, pembatasan jaringan, penghentian manual, karantina APK, checksum/transfer privat, dan cleanup lulus.
- Perbaikan tambahan: polling terlambat tidak mengaktifkan kembali tampilan sesi yang dihentikan; batas password bcrypt 72 byte UTF-8; body autentikasi maksimal 16 KiB; validasi ulang kuis setelah sanitasi.

Artefak dan log: `test-results/system-audit/`. Browser memakai database audit tersendiri dengan fixture terkontrol; hasil fixture bukan prediksi AI. Server audit dan database sementara dibersihkan setelah pengujian. Aplikasi pengembangan dan broker pengguna dipertahankan.

---

# Verifikasi Peringkat Contoh pada Landing Publik

Tanggal: **2 November 2026**. Peringkat belajar pada landing dapat dilihat tanpa login, dengan data contoh yang diminta pengguna:

1. **Dery Wahyu Perdana** — 1.250 EXP.
2. **Alfian Gading Saputra** — 1.100 EXP.
3. **Rafli Maulana** — 950 EXP.

- Label **Data contoh** dan keterangan nama/EXP contoh ditampilkan secara eksplisit. Daftar ini hanya untuk presentasi landing; tidak ada perubahan EXP, streak, lencana, maupun hasil peringkat akun di database.
- Peringkat tetap tampil ketika statistik platform masih memuat atau gagal. Error/retry statistik hanya memengaruhi statistik. Tombol **Mulai belajar** membuka Academy bagi anggota dan mengarahkan tamu ke login dengan tujuan kembali `/academy`.
- **13 pemeriksaan browser Chrome lokal lulus**, 0 gagal, 0 page error. Cakupan: nama/urutan/EXP, tampilan tamu dan anggota, fokus keyboard, login CTA, statistik loading/error/retry, serta layout 320/390/640/768/1024/1440 px tanpa overflow atau nama terpotong.
- API statistik publik tetap mengambil data asli. API peringkat anggota tetap menolak tamu dengan 401. Pengujian anggota memastikan EXP dan streak tidak berubah setelah melihat landing serta membuka Academy; sesi browser diakhiri melalui logout.
- **451 tes Bun lulus**, 0 gagal, 33 file, 2570 assertion. TypeScript, Biome, Prettier file tugas, dan build produksi terbaru berhasil. Perubahan formatter di luar lingkup dipulihkan.

Artefak verifikasi berada di `test-results/landing-ranking/`. Kontrak data contoh dan penggantian ke data asli ada di [community.md](ai-agent-docs/community.md). Hero rubah berlogo Koneksi tetap aktif dan server pengembangan tersedia di port 3000.

---

# Arsip Verifikasi Hero Gateway dan Maskot Rubah

Tanggal: **2 November 2026**. Maskot yang dipilih pengguna adalah **Rubah Investigator**, dengan emblem Koneksi resmi pada patch putih jaket teal. Kontrak aset: [branding.md](ai-agent-docs/branding.md).

- Master transparan berada di `design/guardian-lab-fox-mascot.png`; aset web WebP transparan berukuran 712 × 1056 px, sekitar 104 KiB, berada di `public/brand/guardian-lab-fox.webp`. Prompt edit imagegen bawaan tersimpan di `design/guardian-lab-fox-prompt.md`.
- Hero memakai judul **“Cek dulu. Baru klik.”**, satu kalimat penjelas, dan form pemeriksaan langsung. Badge mengambang, kartu tambahan, serta dekorasi latar hero dihapus.
- Pada desktop, pengantar dan form berada di kiri, sedangkan maskot di kanan. Pada layar kecil, maskot mendampingi pengantar di atas form. Loading fallback menggunakan susunan hero yang sama.
- **20 pemeriksaan browser produksi Chrome lulus**, 0 gagal, 0 page error. Pemeriksaan layout pada lebar 320/390/640/768/1024/1440 px tidak menemukan overflow horizontal atau elemen hero terpotong.
- Tab URL/QR/APK dapat dibuka melalui query URL. Pergantian tab dan tombol back/forward browser mempertahankan pilihan yang sesuai. Keyboard memindahkan fokus dengan panah dan mengaktifkan tab dengan Enter; fokus terlihat.
- URL tidak valid menampilkan error dan memfokuskan input. Input URL valid oleh tamu membuka dialog login dengan target dan tab yang sesuai; Escape menutupnya. Pratinjau/hapus gambar QR, submit disabled, serta penolakan berkas selain APK tetap berfungsi. Tidak ada permintaan analisis yang terkirim dalam pemeriksaan tamu.
- Tampilan pengguna yang sudah masuk diperiksa pada desktop dan ponsel tanpa membuat investigasi atau progres latihan. Sesi pemeriksaan diakhiri melalui logout.
- **451 tes Bun lulus**, 0 gagal, 33 file, 2570 assertion. TypeScript, Biome, Prettier file tugas, dan build produksi berhasil. Perubahan formatter di luar lingkup dipulihkan.
- Aset produksi dibandingkan dengan berkas sumber dan kanal alpha diperiksa. Gambar memakai `next/image`, ukuran responsif, serta pemuatan eager; tidak ada animasi dekoratif pada hero, termasuk dengan preferensi reduced motion.

Artefak browser, screenshot sebelum/sesudah, dan log pemeriksaan berada di `test-results/hero-fox/`. Server pengujian produksi sementara ditutup setelah verifikasi; server pengembangan lokal tetap tersedia pada port 3000.

---

# Arsip Verifikasi Palet Global Navy + Teal dan Logo Koneksi

Tanggal: **2 November 2026**. Identitas terbaru adalah **Koneksi** dengan warna navy `#0F172A` dan teal `#0F766E`. Kontrak aset: [branding.md](ai-agent-docs/branding.md).

- Master `design/guardian-lab-logo.png` menggunakan alpha transparan. Sumber pilihan asli Koneksi tersimpan pada `design/guardian-lab-logo-source.png`.
- Seluruh komponen identitas memakai `public/brand/guardian-lab-koneksi.png` dan teks nama sistem navy/teal. Nama aset baru mencegah cache logo GL lama; endpoint aset lama mengembalikan 404.
- Seluruh antarmuka memakai token navy/teal terpusat: tombol, navigasi, tab/pilihan aktif, tautan, form, fokus, admin, maskot, dan dekorasi. Latar menggunakan `#F8FAFC`, kartu putih, serta border `#E2E8F0`.
- Favicon ICO transparan pada ukuran 16/32/48/256 px dan PNG 256 px. Margin dasarnya diperkecil menjadi 4 px sehingga bentang logo mencapai sekitar 248 px; kanal alpha dan bentang piksel diperiksa. Ikon Apple tetap 180 px dengan latar putih.
- **42 skenario browser produksi Chrome lulus**, 0 page error: 29 pemeriksaan identitas/halaman dan 13 pemeriksaan palet, favicon, validasi, hasil latihan, serta dialog. Layout 320/390/768 px lulus.
- Respons ikon/mark publik berstatus 200 dan byte-identik dengan berkas terbaru. Warna teks identitas diperiksa melalui computed style.
- PNG Share Card memiliki lebar 1200 px dan mengandung area logo navy serta teal yang nyata; gambar ekspor juga diperiksa secara visual.
- **451 tes Bun lulus**, 0 gagal, 33 file, 2570 assertion. TypeScript, Biome, formatter file tugas, dan build produksi berhasil.
- Warna risiko SAFE tetap hijau, WARNING amber, dan PHISHING merah. Field tidak valid mempertahankan warna merah saat fokus, sementara field valid dan pilihan kuis memakai teal. Hasil latihan belum lulus kini amber, hasil lulus hijau.
- Persetujuan admin memakai konfirmasi teal; penolakan dan arsip memakai merah. Pending kuis menampilkan label proses dan tombol disabled; Escape menutup dialog. Semua pemeriksaan menggunakan fixture sementara serta API sebenarnya.
- Audit microinteractions **10/10 (8/8 diagnostik)**: pemicu, state, aturan, feedback langsung, proporsi feedback, pengulangan, mode, dan kemudahan penggunaan pertama terpenuhi. Tidak ada diagnostik gagal pada hasil akhir.
- Satu aturan lint callback dan empat saran template pada pratinjau palet dari pekerjaan sebelumnya dirapikan; pergantian keempat palet tetap berfungsi.
- Akun, kuis, investigasi, kasus, dan progres fixture browser dihapus; empat akun demo tetap tersedia. Server pengembangan lokal dipulihkan pada port 3000.

Artefak pemeriksaan tersimpan di `test-results/koneksi-logo/`. Skrip serta data scratch dihapus setelah pemeriksaan. Bagian di bawah merupakan arsip verifikasi sebelumnya.

---

# Arsip Verifikasi Logo GL Proteksi

Tanggal: **2 November 2026**. Logo pilihan pengguna: **GL Proteksi**, ikon pertama dari pengembangan monogram GL. Kontrak aset dan penggunaan: [branding.md](ai-agent-docs/branding.md).

- Header/footer umum, login/registrasi, sidebar admin, dialog login, serta pratinjau dan ekspor Share Card memakai satu komponen identitas bersama.
- Master transparan tersimpan di `design/guardian-lab-logo.png`; sumber pilihan asli tetap utuh. Seluruh alternatif beserta prompt alternatif dihapus, termasuk salinan hasil generasi lokal. Folder konsep lama sudah tidak ada.
- Favicon ICO memiliki ukuran 16/32/48/256 px, ikon PNG 256 px, dan ikon Apple 180 px. Aset antarmuka memiliki alpha transparan. Semua endpoint ikon publik mengembalikan 200 dan isi berkas yang sesuai.
- **28 skenario browser produksi Chrome lulus**, tanpa page error. Cakupan mencakup halaman publik, auth, user, admin, metadata favicon setiap halaman, serta layout 320/390/768 px.
- Ekspor Share Card menghasilkan PNG 1200 px dan region logo mengandung piksel GL rose; hasil ekspor juga diperiksa secara visual.
- **451 tes Bun lulus**, 0 gagal; TypeScript, Biome, formatter file tugas, dan build produksi berhasil. Perubahan formatter di luar lingkup dipulihkan.
- Data akun/investigasi/kasus fixture browser dibersihkan. Empat akun demo yang diminta tetap tersedia. Aplikasi dikembalikan ke server pengembangan lokal pada port 3000.

Log pemeriksaan, hasil browser JSON, screenshot, serta PNG ekspor berada di `test-results/branding/`. Skrip dan data scratch dihapus setelah pemeriksaan. Fitur analisis dan status kesiapan AI/Android mengikuti hasil audit sebelumnya di bawah.

---

# Hasil Verifikasi — Penyelesaian Audit Alur Lokal

Tanggal: **2 November 2026**. Kontrak terbaru: [flow-consistency.md](ai-agent-docs/flow-consistency.md).

## Hasil saat ini

| Pemeriksaan             | Hasil                                                                                                                    |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Bun + MySQL sementara   | **451 lulus**, 0 gagal, 33 file, 2570 assertion                                                                          |
| TypeScript              | `bunx tsc --noEmit` tanpa error                                                                                          |
| Biome                   | Pemeriksaan seluruh kode tanpa error/warning                                                                             |
| Formatter               | `bun run format` dijalankan; perubahan format di luar lingkup dipulihkan. Pemeriksaan file tugas lulus                   |
| Build produksi          | `bun run build` berhasil                                                                                                 |
| Browser produksi Chrome | **17 skenario terverifikasi**, 0 page error; hasil terkonsolidasi pada `browser.json`                                    |
| Docker nyata            | Watcher karantina, SHA-256/ukuran, transfer privat byte-identik, blokir unduhan lokal, berkas hilang, dan teardown lulus |
| Migrasi lokal           | Enam migrasi terpasang, termasuk `20261102030000_flow_consistency`                                                       |
| Data akun               | Empat akun yang diminta terverifikasi hash, role, password, dan pengalihan login                                         |

## Alur yang diperiksa

- Statistik sesuai database, peringkat memakai alias anonim, dan CTA menuju daftar peringkat sebenarnya. Counter kasus memakai kriteria publikasi yang sama dengan daftar komunitas; approval legacy tanpa snapshot tidak ikut dihitung.
- USER kembali ke landing; ADMIN masuk dashboard. Tab URL/QR hanya menandai Gateway aktif, tab APK hanya APK X-Ray, serta halaman fitur hanya menandai bagian yang sesuai.
- Statistik gagal memuat menampilkan error dan dapat dicoba ulang. Peringkat tanpa EXP menampilkan keadaan kosong, tanpa angka contoh.
- Sesi tidak dibuat sebelum pengguna menekan mulai. URL berparameter memerlukan persetujuan versi bersih. Target dan sumber sesi tersimpan benar; membuka permintaan B ketika A aktif tetap menampilkan A beserta pemberitahuan.
- Stream Chromium nyata berjalan. APK fixture jinak yang selesai ditulis di container dikarantina dan muncul dalam polling; tombol bedah menjalankan ekstraksi nyata dan menyimpan satu investigasi kanonis di riwayat, dengan tautan sumber URL/QR.
- Hasil APK tetap `UNAVAILABLE`, skor null, dan fakta statis memiliki batas cakupan. Tidak ada kesimpulan AI buatan. Tes API menguji retry, sesi berakhir, berkas rusak, autentikasi, dan kepemilikan.
- Dialog penghentian mendukung Escape, mempertahankan pesan kegagalan, dan baru menutup setelah teardown berhasil. Tautan hasil APK tetap tersedia setelah sesi dihentikan.
- Latihan komunitas menolak jawaban belum lengkap, memberi 30 EXP pada kelulusan pertama, dan nol pada pengulangan. Header, lencana, jumlah kasus selesai, latihan terbaru Academy, serta peringkat mencerminkan akun sebenarnya. API soal tidak mengirim kunci sebelum penilaian.
- Login tidak memperpanjang streak belajar. Seeder idempoten mempertahankan nama khusus, riwayat, EXP, dan sesi yang tidak perlu dicabut.
- Pemeriksaan visual menemukan kolom URL menyempit di ponsel dan header meluber di tablet. Kolom kini memakai satu baris penuh pada ponsel; navigasi memakai menu sampai breakpoint desktop besar. Uji ulang 320/390/768 px lulus tanpa overflow, dengan kolom URL tetap terbaca.

## Audit interaksi

Skor **10/10**, dihitung `round(8/8 × 10)`. Tidak ada diagnostik yang gagal pada hasil akhir.

| Diagnostik                     | Bukti hasil akhir                                                                                  |
| ------------------------------ | -------------------------------------------------------------------------------------------------- |
| Pemicu mudah ditemukan         | Tombol mulai, bedah APK, kirim jawaban, retry, dan hentikan berlabel jelas                         |
| Status pemicu terlihat         | Pending/disabled, sesi aktif, target aktual, hasil tersimpan, dan pilihan radio terlihat           |
| Aturan dapat diprediksi        | Persetujuan parameter, satu sesi aktif, satu hasil per unduhan, hadiah sekali per kasus            |
| Feedback langsung              | State pending lokal segera berubah; hasil/error/toast mengikuti respons nyata                      |
| Feedback proporsional          | Konfirmasi untuk teardown, pesan ringkas untuk simpan/error, tanpa selebrasi penghalang            |
| Pengulangan menyesuaikan hasil | Kasus selesai menawarkan latihan ulang tanpa EXP; unduhan tersimpan berubah menjadi tautan riwayat |
| Mode terlihat                  | Target sesi, consent, serta Mode Bahasa Manusia/Geek View eksplisit                                |
| Dapat dipahami pengguna baru   | Keadaan kosong, petunjuk privasi, preview URL bersih, dan langkah selanjutnya tersedia             |

Masalah lebar kolom dan header ditemukan pada audit visual lalu diperbaiki serta diuji ulang; keduanya tidak tersisa sebagai temuan terbuka.

## Bukti dan batas

Artefak lokal berada di `test-results/flow-audit/`: log tes, lint/typecheck/build, migrasi, runtime karantina, hasil browser terkonsolidasi, dan screenshot. Data USER/kasus/investigasi khusus browser sudah dihapus, tanpa sisa container sesi. Empat akun yang diminta dan materi awal tetap tersedia; tidak ada EXP atau hasil model contoh yang ditambahkan untuk demo.

Model AI URL/QR/APK masih menunggu pelatihan. Android dinamis **ditunda sesuai arahan pengguna** karena server Linux/binder belum tersedia. Viewport ponsel remote dan thumbnail sesi juga belum tersedia. Pengujian memakai situs publik serta APK fixture jinak, tanpa malware hidup atau deployment publik. Tidak ada commit, PR, merge, maupun deployment publik.

---

# Arsip Verifikasi — Tahap 8 Sandbox dan Academy

Tanggal: **2 November 2026**. Kontrak dan setup aktif: [sandbox-and-academy.md](ai-agent-docs/sandbox-and-academy.md).

## Hasil akhir tahap 8

| Pemeriksaan                            | Hasil                                                                                                                                                      |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Seluruh tes Bun dengan MySQL sementara | **433 lulus**, 0 gagal, 30 file, 2457 assertion                                                                                                            |
| TypeScript                             | `bunx tsc --noEmit` tanpa error                                                                                                                            |
| Biome                                  | 251 file diperiksa, tanpa error/warning                                                                                                                    |
| Formatter                              | `bun run format` dijalankan; formatter/check perubahan tahap 8 lulus. Perubahan format di luar lingkup dipulihkan agar pekerjaan sebelumnya tetap terjaga. |
| Build produksi                         | `bun run build` berhasil                                                                                                                                   |
| Browser produksi                       | **21 skenario lulus**, 0 page error: 13 Academy/auth/CMS dan 8 sandbox                                                                                     |
| Runtime Docker nyata                   | Stream VNC WebSocket, internet publik, akses bertiket, pemblokiran IP lokal/metadata/domain DNS lokal, blokir internet langsung, dan hapus manual lulus    |
| Watchdog independen                    | Browser dan proxy berhenti/terhapus setelah batas 180 detik ketika broker dibekukan                                                                        |

## Perilaku yang diverifikasi

- USER tetap menuju landing setelah login; ADMIN menuju dashboard. Header dan Academy menampilkan streak nol untuk akun tanpa aktivitas belajar. Header EXP diperbarui setelah jawaban tersimpan.
- API kuis publik tidak mengirim kunci jawaban, penjelasan, atau penanda `isCorrect`. Jawaban jamak harus cocok sebagai set lengkap.
- EXP hanya pada kelulusan pertama. Dua pengiriman bersamaan dan retry UUID yang sama tidak menggandakan EXP atau attempt.
- Revisi usang, opsi asing/duplikat, soal kurang/tambahan, UUID dengan payload berbeda, dan kuis arsip ditolak.
- Streak mengikuti tanggal WIB. Progres, lencana pertama, dan attempt tersimpan setelah reload; akun lain tetap terpisah.
- CMS menulis materi dan soal sebenarnya, memakai pagination 10 kuis, dan konfirmasi arsip yang mempertahankan hasil pengguna.
- Loading, error/retry, empty state, navigasi latihan, serta tampilan desktop/390 px diuji melalui Chrome produksi.
- Membuka halaman sandbox tidak membuat container. Tombol mulai mengalokasikan browser/proxy/jaringan nyata, lalu status dan stream diperbarui dari server.
- Akun lain tidak dapat membaca/menghentikan sesi; URL stream tanpa tiket ditolak. Reload melanjutkan sesi yang sama.
- Gagal menghapus sesi mempertahankan konfirmasi dan rekaman aktif; konfirmasi baru ditutup setelah runtime berhasil menghapus container. Escape memulihkan fokus tombol pemicu.
- Tes regresi mereproduksi respons startup terlambat yang menghidupkan sesi setelah stop. Perbaikan memakai perubahan status bersyarat dan penolakan ID sesi yang sudah dihentikan; tes regresi kemudian lulus.
- Audit microinteraction **10/10 (8/8)**: pemicu, status, aturan, feedback langsung, proporsi feedback, pengulangan, kejelasan mode, dan penggunaan pertama. Tidak ada baris audit yang gagal.

## Bukti dan batas verifikasi

Log/screenshot lokal tersimpan pada `test-results/stage8/`: unit, lint, typecheck, build, runtime watchdog, runtime manual, hasil browser JSON, serta screenshot Academy dan sandbox desktop/mobile. Data akun/kuis/sesi pengujian dan skrip scratch dibersihkan. Tiga materi awal Academy tetap tersedia sebagai konten produk, tanpa akun demo.

Migrasi `20261102010000_academy_progress` dan `20261102020000_sandbox_starting` diterapkan ke MySQL lokal. Broker lokal dijalankan menggunakan kunci dari `.env`; kunci tidak dicetak atau dimasukkan ke git. Tidak ada commit, PR, merge, atau deployment publik.

**Belum tersedia:** model AI; runtime Android dinamis (dukungan binder lokal tidak ditemukan); karantina/watcher unduhan APK; viewport mobile remote; thumbnail sesi; soal gambar/skill tree bertahap. Unduhan browser dan clipboard diblokir. Bedah APK statis tahap 7 tetap berfungsi. Container runtime diuji dengan situs publik jinak, bukan malware hidup; uji deployment publik/host Linux khusus belum dilakukan.

---

# Arsip Verifikasi — Tahap 7 Ekstraksi Statis APK

Tanggal: **2 November 2026**. Tahap 7 menambahkan pembacaan manifest biner/resource, permissions, DEX/hasil JADX, indikator tersanitasi, dan penyimpanan fakta statis pada investigasi yang sama. Kontrak serta setup: [apk-static.md](ai-agent-docs/apk-static.md).

## Perilaku yang diperiksa

- APK asli dibaca melalui JADX 1.5.6 dengan arsip rilis/checksum terverifikasi. Fixture manifest biner mengembalikan package, versi, SDK, label resource, dan DEX sesuai berkas.
- Model tetap belum terhubung: hasil statis tersimpan di `inputMetadata.apkStatic`, investigasi berakhir `UNAVAILABLE`, dan skor/verdict AI tetap `null`. Ekstraksi parsial diberi peringatan, termasuk APK tanpa DEX atau kode yang gagal didekompilasi.
- Arsip palsu, manifest hilang/rusak, DTD/entity XML, traversal/jalur Windows/symlink/duplikasi, rasio kompresi berlebihan, ukuran entri berlebih, dan CRC rusak ditolak.
- Token bot hanya menjadi hitungan/fingerprint SHA-256. Kontak, kredensial, path/query, komentar, serta konstanta sensitif disamarkan; teks asset mentah tidak disalin ke potongan kode. Alamat nonaktif tidak disimpulkan sebagai C2 berbahaya.
- Ekstraksi dibatasi proses aktif, waktu/memori, jumlah/ukuran arsip, hasil disk/pesan proses, dan cakupan pembacaan sumber. Pembatalan mematikan Java dan membersihkan direktori temp milik job.
- API mengembalikan fakta tersimpan dengan ID kanonis yang sama ketika dibuka dari landing/riwayat. Berkas palsu menghasilkan rekaman `FAILED` yang nyata; mesin sibuk 429 tidak membuat pengajuan baru. APK biner tidak disimpan permanen.
- Mode manusia menjelaskan deklarasi izin tanpa mengklaim izin diberikan atau perilaku pencurian. Mode teknis menampilkan hash, metadata/cakupan, origin nonaktif, dan potongan Java tersanitasi dengan provenance.
- Static-only tidak membuka Share Card atau publikasi komunitas. Akses pemilik/admin tetap diperiksa, reload tidak menjalankan ulang dekompilasi, dan error baca dapat dipulihkan melalui retry GET.

## Pemeriksaan akhir

| Pemeriksaan                | Hasil                                               |
| -------------------------- | --------------------------------------------------- |
| `bun run apk:setup`        | JADX 1.5.6 terpasang, SHA-256 sesuai rilis resmi    |
| `bun run format`           | Lulus; perubahan di luar lingkup dipulihkan         |
| `bun run lint`             | Lulus, 223 file diperiksa                           |
| `bunx tsc --noEmit`        | Lulus                                               |
| `bun test`                 | 415 lulus, 0 gagal; 28 file, 2.405 assertion        |
| `bun run build`            | Lulus; JAR/metadata verifikasi ikut pada standalone |
| Chrome pada build produksi | 19 skenario lulus, 0 page error                     |

Pengujian browser memakai pemilih berkas asli, memeriksa model tetap kosong, persistensi/reload, sumber Java nyata, masking seluruh DTO, respons sibuk/gagal, pembatasan akses, serta laporan mobile tanpa overflow. Perpindahan halaman saat unggahan lama berlangsung diuji agar respons lama tidak mengarahkan pengguna kembali ke landing.

Audit manual microinteractions: **10/10** (8/8 diagnostik terpenuhi; tidak ada diagnostik gagal). Tindakan dan status terlihat, navigasi tidak tertahan proses jaringan, retry tidak mengulang dekompilasi, hasil parsial/empty dijelaskan, dan mode serta rincian bukti dapat dibuka dengan kontrol standar.

JADX terpasang pada workspace lokal; Java sudah tersedia. Build standalone menyertakan JAR dan catatan verifikasinya. Dockerfile telah diselaraskan untuk setup alat/generate Prisma, tetapi pengujian container belum dilakukan karena daemon Docker lokal tidak aktif.

Fixture APK internal dilengkapi sumber, hash, dan lisensi di `tests/fixtures/apk/NOTICE.md`. Tidak ada preset/sampel baru pada website. Pengujian browser memakai akun dan berkas sintetis sementara, lalu membersihkan data tersebut. Artefak lokal berada di `test-results/stage7-apk/`.

**Batas tahap ini:** model/DeepSeek dan eksekusi APK di emulator belum dihubungkan. Analisis statis tidak memverifikasi tanda tangan/installability dan tidak mencakup seluruh kode terenkripsi/obfuscation atau perilaku runtime. Tidak ada migrasi database atau environment baru.

---

# Hasil Verifikasi — Tahap 6 Kontribusi dan Moderasi Komunitas

Tanggal: **2 November 2026**. Tahap 6 menghubungkan investigasi tersimpan, persetujuan pengaju, antrean admin, keputusan moderasi, dan pembacaan kasus disetujui. Kontrak: [community.md](ai-agent-docs/community.md). Catatan tahap sebelumnya tetap diarsipkan di bawah.

## Perilaku yang diperiksa

- Pengajuan berasal dari ID hasil lengkap milik pengguna. Free-text/raw evidence, target/risiko kiriman klien, consent kosong, JSON rusak, dan body berlebih ditolak.
- Model belum tersedia, pending/gagal, legacy, dan hasil tidak lengkap tidak dapat diajukan. Score nol dan jenis URL/QR/APK dipertahankan pada snapshot.
- Preview, snapshot tersimpan, moderasi, dan detail komunitas membaca hasil yang sama. Snapshot tidak berubah mengikuti koreksi sumber setelah pengajuan.
- Data pribadi, kredensial, nilai query/fragment, token/DEX mentah, identitas pengaju, dan ID sumber privat tidak masuk keluaran anggota lain. Indikator tetap dinonaktifkan ketika disaring ulang.
- Persetujuan eksplisit diperlukan; klik ganda dan pengajuan bersamaan menghasilkan satu pengajuan dengan ID yang sama.
- Pending/ditolak hanya dapat dibuka pemilik/admin. Catatan penolakan tersanitasi tampil kepada pemilik, sedangkan publik hanya membaca kasus disetujui yang memenuhi kontrak snapshot/persetujuan/sumber.
- Persetujuan admin memerlukan konfirmasi privasi dan dialog akhir. Penolakan memerlukan alasan. Error mempertahankan dialog agar dapat dipulihkan; keputusan bersamaan tidak menimpa satu sama lain. Admin tidak meninjau pengajuan sendiri.
- Daftar pribadi, antrean admin, dan daftar disetujui memiliki filter/pagination dengan total terfilter. Status/mode teknis/pencarian bukti dapat dibuka ulang dari URL. Error dibedakan dari keadaan kosong dan menyediakan retry.
- Membaca kasus atau memanggil endpoint attempt tidak memberikan EXP rekaan. Leaderboard dan skenario contoh tidak digunakan pada halaman komunitas.
- Migrasi MySQL menambahkan relasi sumber unik, persetujuan, dan reviewer tanpa menghapus data lama. Sumber yang dihapus membuat kasus tersembunyi dari anggota lain, sementara snapshot masih dapat ditinjau pemilik/admin.

## Pemeriksaan akhir

| Pemeriksaan                | Hasil                                                 |
| -------------------------- | ----------------------------------------------------- |
| `bun run format`           | Lulus; perubahan di luar lingkup tahap ini dipulihkan |
| `bun run lint`             | Lulus, 207 file diperiksa                             |
| `bunx tsc --noEmit`        | Lulus                                                 |
| `bun test`                 | 397 lulus, 0 gagal; 26 file, 2.317 assertion          |
| `bun run build`            | Lulus                                                 |
| Chrome pada build produksi | 25 skenario lulus, 0 page error                       |

Uji browser tambahan memastikan consent direset ketika ID sumber berubah, dialog mobile tetap dalam viewport, serta fokus keyboard dan pembatalan bekerja. Tampilan desktop/ponsel diperiksa melalui screenshot.

Audit manual microinteractions: **10/10**, 8/8 diagnostik terpenuhi dan tidak ada diagnostik gagal. Persetujuan, status proses, hasil akhir, konfirmasi, dan pemulihan kesalahan terlihat jelas.

Akun, investigasi, dan kasus fixture bersifat sementara dan dibersihkan setelah uji. Artefak lokal berada di `test-results/stage6-community/`. Tidak ada pesan yang dikirim, data pengguna nyata diterbitkan, atau seed contoh ditambahkan ke website.

**Batas tahap ini:** model URL/QR/APK belum terhubung; input baru tetap `UNAVAILABLE`. Latihan replay berbasis pertanyaan/bukti dan leaderboard EXP masih backlog. Tidak ada dependency atau environment baru. Migrasi `20261102000000_community_moderation` sudah diterapkan pada database lokal.

---

# Hasil Verifikasi — Tahap 5 Guardian Share Card

Tanggal: **1 November 2026**. Tahap 5 pada urutan kerja selama model dilatih menghubungkan hasil investigasi tersimpan dengan pratinjau, ekspor PNG, pesan WhatsApp, dan berbagi file. Kontrak: [share-card.md](ai-agent-docs/share-card.md). Catatan tahap terdahulu tetap diarsipkan di bawah.

## Perilaku yang diperiksa

- Generator hanya membaca investigasi berdasarkan ID dengan sesi pemilik/admin. Query target atau isi palsu tidak memengaruhi kartu.
- Hasil lengkap dapat menjadi kartu meski temuan kurang dari tiga atau kosong. SAFE/LOW dengan skor nol tetap netral; verdict mengikuti hasil tersimpan.
- Pending, gagal, model tidak tersedia, legacy, dan hasil tidak lengkap tidak diekspor. Perubahan PROCESSING menjadi COMPLETED terpantau otomatis.
- URL/indikator di dalam target dan prosa dinonaktifkan. PII, kredensial, query/fragment rahasia, termasuk URL yang rusak akibat penyamaran terdahulu, tidak ikut dibagikan. Tidak ada klaim resmi atau verifikasi rekaan.
- Unduhan PNG nyata memiliki lebar 1200 px. Piksel hasil mobile 390 px sama dengan desktop; tidak ada overflow horizontal. Konten panjang dipersingkat dengan penanda dan domain lengkap tetap terlihat.
- PNG siap digunakan ulang untuk unduhan berikutnya. Nama file menyertakan jenis URL/QR/APK dan ID.
- Penolakan clipboard menampilkan pesan read-only yang bisa dipilih/disalin manual. Kegagalan ekspor menampilkan retry yang berhasil pulih.
- Web Share menerima file PNG yang sudah disiapkan. Klik ganda dicegah, pembatalan tidak dianggap pengiriman, dan kegagalan menawarkan unduh manual. Browser tanpa dukungan memakai unduh/salin.
- HTTP 500 menyediakan retry GET dan menonaktifkan ekspor data lama. Pengguna lain ditolak, admin dapat meninjau, dan sesi berakhir menghilangkan kartu.

Pengujian browser menggunakan fixture sementara, clipboard/Web Share terkontrol, dan build produksi standalone. Tidak ada pesan yang dikirim ke orang lain. Akun serta rekaman fixture dibersihkan setelah pengujian. Artefak lokal disimpan di `test-results/stage5-share-card/`.

## Pemeriksaan akhir

| Pemeriksaan                | Hasil                                                        |
| -------------------------- | ------------------------------------------------------------ |
| `bun run format`           | Lulus; perubahan format di luar lingkup tahap ini dipulihkan |
| `bun run lint`             | Lulus, 191 file diperiksa                                    |
| `bunx tsc --noEmit`        | Lulus                                                        |
| `bun test`                 | 373 lulus, 0 gagal; 25 file, 2.211 assertion                 |
| `bun run build`            | Lulus                                                        |
| Chrome pada build produksi | 24 skenario lulus, 0 page error                              |

Audit manual microinteractions: **10/10** (8/8 diagnostik terpenuhi); tidak ada diagnostik gagal. Status persiapan/salin/berbagi terlihat, error memiliki pemulihan, file siap dipakai ulang, dan fallback sesuai dukungan browser.

**Batas tahap ini:** model URL/QR/APK belum dihubungkan. Input baru tetap UNAVAILABLE; kartu tersedia setelah worker menghasilkan hasil lengkap yang valid. Kontribusi/moderasi komunitas mengikuti tahap 6. Tidak ada migrasi, dependency, atau environment baru pada tahap ini.

---

# Hasil Verifikasi — Tahap 4 Hasil dan Riwayat

Tanggal: **1 November 2026**. Tahap 4 pada urutan kerja sambil menunggu model menghubungkan hasil landing dan riwayat ke satu rekaman tersimpan. Rincian kontrak: [results-and-history.md](ai-agent-docs/results-and-history.md). Catatan tahap terdahulu tetap diarsipkan di bawah.

| Pemeriksaan                   | Hasil                                                        |
| ----------------------------- | ------------------------------------------------------------ |
| `bunx tsc --noEmit`           | Lulus                                                        |
| `bun run lint`                | Lulus, 186 file, tanpa error/warning                         |
| `bun run format`              | Lulus; 74 perubahan formatter di luar tahap ini dikembalikan |
| `bun test`                    | **356 lulus, 0 gagal**, 24 file, 2.148 assertions            |
| `bun run build`               | Lulus                                                        |
| Browser production standalone | **21 skenario lulus**, tanpa page error                      |

Landing menulis ID tersimpan ke URL dan membaca hasil dari endpoint detail, sehingga reload memulihkan rekaman yang sama. Hasil dan daftar/detail riwayat memakai DTO yang sama. Riwayat mendukung pagination, filter jenis/status/risiko/tanggal, serta total dan ringkasan dari seluruh data yang sesuai filter.

Uji MySQL memeriksa total lintas halaman, pagination deterministik tanpa duplikasi, ukuran halaman, filter sebelum pagination, rentang tanggal, penolakan parameter invalid, isolasi owner/admin, respons detail/list identik, perlindungan legacy saat dibaca, serta pengecualian laporan legacy/parsial dari statistik dan filter risiko terverifikasi. Uji client mengklasifikasikan error dan menolak payload sukses yang tidak valid. Uji render menggantikan pemeriksaan fixture lama dengan render komponen untuk skor nol, label verdict tersimpan, bukti kosong tanpa kesimpulan rekaan, serta hasil legacy/parsial.

Chrome produksi memeriksa akun kosong, permalink landing/reload, mode/ID antara landing dan detail, refresh tanpa rekaman baru, retry GET saat server gagal, payload sukses rusak, not-found, akses rekaman pemilik lain, pagination dan total, reset halaman ketika filter berubah, kondisi filter kosong, tanggal kalender lokal, polling `RECEIVED → PROCESSING → COMPLETED` pada ID yang sama, skor nol sah, ketiadaan bukti teknis, refresh/pencarian bukti, label legacy, hasil parsial, rentang invalid, viewport 390 px tanpa overflow, revokasi sesi, serta USER login kembali ke hasil yang diminta di landing.

Perubahan status/hasil lengkap pada pengujian browser berasal dari fixture terkontrol di akun uji. Model nyata belum dihubungkan; input baru tetap `UNAVAILABLE` dengan risiko `null`. Tombol pembaruan hanya membaca status, tanpa memulai analisis ulang. Tidak ada migrasi database baru atau dependensi tambahan.

Build produksi sempat menolak pembacaan search params di fallback landing. Area investigasi dipisah ke batas Suspense tersendiri, lalu build dan browser produksi dijalankan ulang sampai lulus. Konten landing statis tetap berada di luar area data dinamis.

Audit manual microinteractions: **10/10**, delapan diagnostik terpenuhi tanpa baris gagal. Tidak ada klaim audit WCAG menyeluruh.

Artefak lokal: `test-results/stage4-results/` berisi log, hasil browser/database, serta screenshot. Akun sementara dan rekamannya dibersihkan setelah pengujian; berkas eksekusi sementara dihapus.

---

# Hasil Verifikasi — Tahap 3 Alur Input

Tanggal: **1 November 2026**. Tahap ini melanjutkan pusat data investigasi dengan input URL/QR nyata, validasi bersama, serta penanganan unggahan APK yang konsisten. Spesifikasi aktif: [input-flow.md](ai-agent-docs/input-flow.md).

| Pemeriksaan                   | Hasil                                                        |
| ----------------------------- | ------------------------------------------------------------ |
| `bunx tsc --noEmit`           | Lulus                                                        |
| `bun run lint`                | Lulus, 175 file, tanpa error/warning                         |
| `bun run format`              | Lulus; 79 perubahan formatter di luar tahap ini dikembalikan |
| `bun test`                    | **329 lulus, 0 gagal**, 22 file, 2.054 assertions            |
| `bun run build`               | Lulus                                                        |
| Browser production standalone | **17 skenario lulus**, tanpa page error                      |

URL langsung dan URL hasil QR memakai skema normalisasi serta service penerimaan yang sama. Domain tanpa protokol menggunakan HTTPS; kredensial pada URL dan input yang tidak valid ditolak. QR mempertahankan jenis/provenance serta hanya menghasilkan satu rekaman, tanpa permintaan URL kedua.

Uji regresi baru meliputi URL/IDN/port, batas karakter sebelum dan sesudah normalisasi, query yang disanitasi, QR berkredensial, file kosong/terlalu besar/ganda, MIME yang tidak tersedia, serta pembatasan stream ketika Content-Length hilang atau mengaku lebih kecil. Decoder diuji dengan QR grayscale, grayscale-alpha, transparan, JPG, WebP, SVG yang menyamar sebagai gambar, serta gambar di atas batas piksel.

Browser Chrome memeriksa validasi kosong dan fokus, dialog tamu/Escape, penolakan scheme sebelum request, normalisasi URL tersimpan, pembersihan hasil lama saat input berubah, dua submit sinkron yang hanya menghasilkan satu request, kontrol pending/reduced motion, keyboard tab, drag-and-drop QR, penggantian berkas invalid yang menghapus pilihan lama, satu rekaman QR, hapus/pilih ulang berkas, Back browser dengan berkas tetap terpilih, QR gagal dengan ID tersimpan, APK kosong/ekstensi huruf besar, retry server yang benar-benar mengirim ulang, kegagalan jaringan yang mengarahkan ke riwayat, serta layar 390 px tanpa overflow.

Audit manual microinteractions: **10/10**, seluruh delapan diagnostik terpenuhi; tidak ada baris gagal. Tidak ada klaim pengujian WCAG menyeluruh.

Model tetap belum tersedia dan risiko tetap `null`. APK hanya menyimpan metadata serta SHA-256; biner dan dekompilasi belum tersedia. Tidak ada migrasi database tambahan pada tahap ini.

Akun browser sementara beserta rekamannya dibersihkan. Artefak lokal berada di `test-results/stage3-input/`; berkas eksekusi sementara dibersihkan setelah verifikasi.

---

# Hasil Verifikasi — Tahap 2 Rekaman Investigasi

Tanggal: **1 November 2026**. Tahap ini mengikuti urutan kerja baru selama pelatihan model berlangsung. Catatan autentikasi tahap 4 sebelumnya tetap disimpan di bagian arsip.

Sumber data tunggal menggunakan `ForensicRecord`, dengan ID tersimpan, pemilik sesi, jenis URL/QR/APK, status, metadata, bukti, hasil nullable, sumber/versi model, alasan kegagalan, serta waktu proses. Rujuk [dokumentasi investigasi](ai-agent-docs/investigations.md).

| Pemeriksaan                   | Hasil                                                                                                                            |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Migrasi MySQL                 | Dua migrasi diterapkan; status database sesuai schema, tanpa reset                                                               |
| Preservasi data lama          | SQL migrasi diuji pada tabel berisi laporan lama; skor, ringkasan, dan tanggal tetap tersimpan dengan sumber `LEGACY_UNVERIFIED` |
| `bunx tsc --noEmit`           | Lulus                                                                                                                            |
| `bun run lint`                | Lulus, 169 file, tanpa error/warning                                                                                             |
| `bun run format`              | Lulus; perubahan formatter di berkas di luar tahap ini dikembalikan                                                              |
| `bun test`                    | **294 lulus, 0 gagal**, 21 file, 1.979 assertions                                                                                |
| `bun run build`               | Lulus                                                                                                                            |
| Runtime production standalone | **10 pemeriksaan browser lulus**, tanpa page error                                                                               |

Pemeriksaan lifecycle menggunakan MySQL nyata pada database uji terisolasi: transisi status, kepemilikan, hasil tidak valid, dua update terminal yang bersaing, sanitasi target, kegagalan persistensi tanpa ID palsu, pembacaan detail berulang, filter status, unggahan APK aktual, serta QR satu piksel/non-URL. Skenario yang sebelumnya mengharapkan skor simulasi diperbarui ke kontrak aktif yang menyatakan model belum tersedia.

Browser Chrome memeriksa tamu ditolak, URL disimpan dengan ID nyata dan risiko `null`, ID tetap sama setelah navigasi/reload, mode teknis tersinkron di URL, pembacaan piksel QR nyata dengan satu rekaman bertipe QR, sidik APK tanpa temuan palsu, filter riwayat, error/retry daftar dan detail, penolakan Share Card tanpa hasil, serta laporan mobile 390 px tanpa overflow.

Validasi origin juga diuji terhadap normalisasi alamat loopback oleh Next.js. Host yang sama diterima pada localhost maupun 127.0.0.1, sedangkan perpindahan host, port berbeda, dan origin asing tetap ditolak.

Pengujian produksi menemukan DLL libvips tidak ikut tracing Sharp pada Windows. `next.config.ts` diperbaiki untuk menyertakan berkas native pendamping; QR kemudian lulus pada runtime standalone. Artefak build dijalankan melalui `server.js` dengan aset static/public, sesuai dokumentasi Next.js terpasang.

Seluruh akun browser sementara beserta rekamannya dan database uji telah dibersihkan. Tidak ada akun admin atau data demo permanen yang ditambahkan.

Batas tahap ini: integrasi model dan antrean belum dibuat; `UNAVAILABLE` tidak diproses ulang otomatis. APK menyimpan metadata/SHA-256, sementara biner dan ekstraksi statis belum tersedia. Rekaman yang belum dianalisis tidak memiliki label aman/berbahaya atau skor pengganti.

Artefak lokal: `test-results/stage2/` berisi log pemeriksaan, hasil browser/database, dan screenshot mobile. Berkas sementara eksekusi dibersihkan setelah verifikasi.

---

# Hasil Verifikasi Guardian Lab — Tahap 4

Tanggal pemeriksaan: **1 November 2026**.

Tahap 4 mengimplementasikan autentikasi dan akses berdasarkan peran: **USER kembali ke landing**, sedangkan **ADMIN menuju dashboard**. Kontrak dan lokasi kode terdapat di [panduan autentikasi](ai-agent-docs/authentication.md).

## Pemeriksaan Otomatis

| Perintah            | Hasil                                                                                                                   |
| :------------------ | :---------------------------------------------------------------------------------------------------------------------- |
| `bunx tsc --noEmit` | Lulus, tanpa error tipe.                                                                                                |
| `bun run lint`      | Lulus, 162 file diperiksa.                                                                                              |
| `bun test`          | **269 lulus, 0 gagal**, 1914 assertion pada 19 file.                                                                    |
| `bun run build`     | Lulus, termasuk dashboard dan halaman terlindungi dengan Cache Components.                                              |
| Formatter           | `bun run format` selesai; format file perubahan diperiksa. Perubahan format pada file di luar lingkup tidak disertakan. |

Suite memakai MySQL nyata pada database sementara yang dibuat, dimigrasikan, diisi fixture, lalu dihapus otomatis. Database aplikasi dan file `.env` tidak diganti oleh proses test.

## Pemeriksaan Browser

Chrome headless memakai profil baru tanpa ekstensi. Server pengembangan diperiksa pada desktop 1440 × 1000 dan mobile 390 × 844.

| Skenario                                                                                  | Hasil                                                                         |
| :---------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------- |
| Tamu membuka history, Academy, komunitas, sandbox web/Android, Share Card, dan area admin | Dialihkan ke login; sembilan route diperiksa melalui HTTP.                    |
| Tamu memanggil API analisis dan pembuatan sandbox                                         | Ditolak dengan HTTP 401.                                                      |
| Tamu mengirim input URL dari landing                                                      | Dialog login muncul; fokus keyboard berada di dialog dan Escape menutupnya.   |
| USER login dengan parameter redirect ke admin                                             | Tetap menuju landing `/`.                                                     |
| USER membuka fitur setelah login                                                          | Status sesi aktif muncul dan tautan fitur terbuka, termasuk history.          |
| USER melakukan analisis URL                                                               | HTTP 200; rekaman tersimpan atas nama akun yang melakukan analisis.           |
| USER membuka admin                                                                        | Halaman kembali ke landing; API admin menolak dengan HTTP 403.                |
| Sesi USER kedaluwarsa pada database                                                       | API menolak dengan HTTP 401; halaman terlindungi kembali ke login.            |
| ADMIN login meskipun parameter redirect meminta landing                                   | Menuju `/admin`.                                                              |
| Dashboard admin                                                                           | Hitungan pengguna cocok dengan database; bank soal dan moderasi dapat dibuka. |
| Role ADMIN diturunkan menjadi USER pada database                                          | API admin ditolak dan halaman admin kembali ke landing.                       |
| Sesi ADMIN dicabut dari database                                                          | API menolak dengan HTTP 401 dan form login dapat dibuka kembali.              |
| Registrasi melalui browser                                                                | HTTP 201, kembali ke landing, fitur terbuka, dan logout mobile berhasil.      |
| Dashboard mobile                                                                          | Ketiga menu utama terlihat dan overflow horizontal 0 piksel.                  |
| JavaScript selama alur browser                                                            | Tidak ada exception runtime yang tertangkap.                                  |

Akun browser dan rekaman turunannya dibersihkan setelah pemeriksaan. Pemeriksaan terakhir tidak menemukan database sementara test yang tersisa.

## Aksesibilitas dan Interaksi

- Fokus navigasi admin diverifikasi dengan tombol Tab: `:focus-visible` aktif dengan outline 2 piksel.
- Indikator logout menampilkan keadaan menunggu dan mencegah pengiriman ulang.
- Dengan preferensi reduced motion, animasi indikator logout berhenti sementara teks status tetap tersedia.
- Dialog akses memakai Base UI untuk pengelolaan fokus dan penutupan keyboard.
- Pemetaan font diperbaiki; computed font sekarang `Geist, "Geist Fallback"`.

Penilaian manual checklist microinteractions: **10/10 (8 dari 8 kriteria)**. Dua kekurangan awal, arah login berdasarkan peran dan penanda akses fitur, sudah ditutup. Penilaian interaksi ini bukan ukuran keamanan otomatis.

## Perbaikan Fondasi Test

Baseline tahap 3 memiliki 211 test lulus dan 6 gagal karena akun seed yang diasumsikan tersedia. Setup sekarang membuat fixture sendiri pada database terisolasi, sehingga keenam skenario tersebut dapat dijalankan.

Harness tidak lagi mengganti handler yang hilang atau melempar error dengan respons oracle. Test regresi memastikan handler atau method yang tidak tersedia menyebabkan kegagalan dan respons helper berasal dari `LIVE_ROUTE`. Sesi fitur merupakan sesi database nyata; object cookie kosong dipakai untuk tamu.

Cakupan tambahan meliputi penolakan tamu pada 20 handler, pembatasan admin, kepemilikan history/sandbox, privasi kasus belum disetujui, revokasi dan kedaluwarsa sesi, JSON/cookie rusak, penolakan Origin asing, registrasi yang selalu USER, serta rollback akun ketika pembuatan sesi gagal.

## Batas Verifikasi

- Browser memakai server pengembangan. Build production lulus; deployment dan runtime production belum dijalankan pada tahap ini.
- Test matematika, fixture, dan kontrak tetap bukan bukti bahwa seluruh fitur aplikasi selesai.
- Analisis APK dan orkestrasi kontainer sandbox masih memerlukan implementasi nyata pada tahap berikutnya.
- UI manajemen pengguna dan audit log admin masih merupakan backlog.
- Tidak ada akun admin permanen atau akun demo yang dibuat oleh pemeriksaan ini.

Artefak lokal berada di `test-results/stage4/`: log typecheck, lint, test, build, hasil browser dan aksesibilitas, serta screenshot dashboard desktop/mobile. Folder ini diabaikan Git dan terpisah dari cache Next.js.
