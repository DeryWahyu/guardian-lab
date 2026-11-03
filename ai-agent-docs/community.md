# Kontribusi dan Moderasi Komunitas — Tahap 6

## Alur pengguna

1. Buka hasil lengkap dari landing, detail riwayat, atau Guardian Share Card, lalu pilih **Ajukan ke komunitas**.
2. Halaman `/community/submit?id=...` mengambil investigasi milik pengguna melalui API. Preview menampilkan snapshot anonim dengan mode manusia/teknis, risiko tersimpan, ringkasan, dan bukti yang diizinkan.
3. Pengguna meninjau snapshot dan mencentang persetujuan untuk moderasi serta penerbitan anonim. Tombol **Ajukan untuk ditinjau** mengirim ID investigasi dan persetujuan, tanpa menerima judul, target, skor, atau bukti buatan klien.
4. Pengajuan berstatus `PENDING_REVIEW`. Pengguna melihat status lewat **Pengajuan saya** di komunitas atau melalui halaman pengajuan/detail kasus yang sama.
5. Admin membuka kasus dari `/admin/community-reviews`, memeriksa snapshot, lalu memilih persetujuan atau penolakan. Persetujuan memerlukan konfirmasi privasi; penolakan memerlukan alasan minimal 10 karakter. Dialog konfirmasi adalah langkah akhir sebelum keputusan disimpan.
6. `APPROVED` tampil pada daftar kasus anggota komunitas. `REJECTED` tetap privat dan pemilik dapat membaca catatan admin. Pengajuan yang ditolak tidak dikirim ulang dengan sumber yang sama; temuan baru menggunakan investigasi baru.

Semua halaman/API komunitas memerlukan sesi USER/ADMIN. Admin dapat meninjau pengajuan pengguna lain; pengajuan admin sendiri memerlukan admin lain. Identitas pengaju tidak ditampilkan pada daftar maupun detail kasus anggota lain.

## Snapshot dan privasi

`lib/community/report.ts` membuat snapshot versi 1 dari hasil investigasi lengkap yang valid. Status diterima/diproses/gagal/model tidak tersedia, hasil parsial, dan sumber legacy tidak memenuhi syarat. SAFE/LOW dan skor nol tetap mengikuti hasil tersimpan tanpa klaim penipuan atau jaminan keamanan.

Snapshot berisi jenis input, target dinonaktifkan, verdict/skor, kategori, ringkasan, temuan nyata, sumber/versi model, serta waktu hasil. Sanitasi yang sama diterapkan kembali saat dibaca. Penyaringan ulang mempertahankan indikator yang sudah dinonaktifkan. URL query/fragment dan kredensial dibuang; karakter kontrol serta PII yang dikenali disamarkan. Moderator tetap memeriksa isi sebelum publikasi.

Bukti teknis hanya mengikutkan entropy yang memang tercatat, nama izin `android.permission.*` yang memenuhi pola, serta origin C2 HTTP/S yang dinonaktifkan. Path/query C2, token, potongan kode/DEX mentah, metadata unggahan, identitas pemilik, dan ID investigasi privat tidak dimasukkan ke snapshot publik. Tidak ada bukti/temuan pengganti ketika hasil kosong.

Snapshot disimpan ketika pengajuan dibuat. Preview pengajuan yang sudah ada, detail admin, dan detail komunitas membaca snapshot tersebut sehingga koreksi sumber sesudahnya tidak mengubah bukti yang ditinjau. Tidak ada unggahan ulang berkas APK pada tahap ini.

`sourceRecordId` unik mencegah duplikasi; klik ganda maupun pengiriman ulang setelah gangguan jaringan mengembalikan pengajuan yang sama. Keputusan hanya dapat mengubah `PENDING_REVIEW` satu kali, dengan pemeriksaan atomik di database. Persetujuan pengguna, identitas reviewer internal, dan waktu tinjauan dicatat. Catatan admin disaring serta hanya diberikan kepada pemilik/admin.

Kasus lama tanpa snapshot/persetujuan/sumber yang valid tidak diterbitkan. Admin dapat menolaknya dengan alasan. Penghapusan investigasi sumber membuat relasi nullable dan menyembunyikan kasus dari anggota lain; snapshot masih dapat diperiksa oleh pemilik/admin. Penghapusan akun pengaju mengikuti cascade kasusnya.

## Kontrak API

| Endpoint                                        | Perilaku                                                                                                |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `GET /api/community/submit?investigationId=...` | Preview dan pengajuan yang sudah ada; hanya pemilik sumber                                              |
| `POST /api/community/submit`                    | JSON `{ investigationId, consent: true }`; 201 baru, 200 jika sudah ada                                 |
| `GET /api/community/replays`                    | Envelope `{ items, pagination }`; hanya kasus disetujui yang valid                                      |
| `GET /api/community/replays?view=mine`          | Pengajuan milik pengguna, termasuk pending/ditolak dan catatan admin                                    |
| `GET /api/community/replays/:id`                | Detail disetujui; pending/ditolak hanya pemilik/admin                                                   |
| `GET /api/admin/community-reviews`              | Antrean admin; default `PENDING_REVIEW`                                                                 |
| `PUT /api/admin/community-reviews/:id`          | `{ status: "APPROVED", privacyConfirmed: true, adminNotes? }` atau `{ status: "REJECTED", adminNotes }` |

Filter daftar: `q` maksimal 150 karakter, `type=URL|QR|APK`, `status` untuk pengajuan sendiri/admin, `page` mulai 1, `pageSize` default 12/maksimal 30. Filter dan halaman tersimpan dalam URL. Daftar menggunakan total hasil terfilter dan urutan stabil. Respons GET memakai `Cache-Control: private, no-store`.

Mutasi menggunakan bounded JSON, validasi Zod strict, pemeriksaan origin dan sesi/peran aktual. Ukuran submit maksimal 4 KiB dan keputusan 8 KiB. Status 400 untuk payload/filter tidak valid, 401/403 untuk akses, 404 untuk kasus tidak tersedia, dan 409 untuk hasil belum layak atau keputusan yang sudah berubah. Pengguna mendapat status proses, pesan kegagalan, retry baca, dan panduan memeriksa status sebelum mengirim ulang.

## Database dan batas tahap

Migrasi `20261102000000_community_moderation` menambah `sourceRecordId` unik/nullable dengan FK ke investigasi, `consentedAt`, dan `reviewerId` dengan FK ke akun admin. Migrasi bersifat menambah kolom; data lama tidak dihapus atau diberi persetujuan otomatis. Terapkan `bunx prisma migrate deploy` dan jalankan `bunx prisma generate` setelah memperbarui kode. Docker tetap memakai alur migrasi/generate yang sama; tidak ada dependency OS atau environment baru.

Komunitas menyediakan pengajuan, moderasi, pembacaan, latihan berbasis bukti, dan leaderboard EXP aktual. Membaca kasus tidak memberi EXP. Model URL/QR/APK masih belum terhubung, sehingga input baru tetap `UNAVAILABLE` sampai model siap.

## Verifikasi

Tes MySQL memeriksa kepemilikan, consent, payload palsu/berlebih, penolakan hasil belum lengkap/legacy, pengajuan bersamaan, keputusan bersamaan, batas tinjauan sendiri, snapshot tetap, anonimisasi, pagination, serta relasi ketika sumber dihapus. Browser memeriksa persetujuan, konfirmasi penerbitan, error/retry, konflik status, penolakan, filter, mode teknis, sesi, dan tampilan mobile. Semua akun/sumber/kasus fixture bersifat sementara dan dibersihkan setelah pengujian.

Audit manual microinteractions: **10/10** (8/8 diagnostik). Tombol dan status terlihat, persetujuan eksplisit, keputusan terkonfirmasi, pending/error menyediakan feedback langsung, retry tidak membuat duplikasi, status akhir menggantikan form, serta mode dan fallback terlihat. Tidak ada diagnostik gagal pada alur akhir. Rincian hasil ada di [TEST_READY.md](../TEST_READY.md).

## Latihan dan peringkat

GET /api/community/replays/:id/challenge hanya tersedia untuk kasus APPROVED dengan snapshot, consent, dan sumber yang valid. Tiga soal diturunkan secara deterministik dari kategori risiko, bukti tersimpan, dan tindakan yang sesuai. Respons tidak membocorkan kunci atau pembahasan. Tidak ada pemanggilan AI baru.

POST attempt menerima revision, submissionId UUID, serta pasangan questionId/optionId. Semua tiga soal harus benar; kelulusan pertama per kasus memberikan 30 EXP dan lencana Pembaca Bukti tanpa bonus EXP. Gagal/ulang memberi nol EXP. Transaksi mengunci akun/kasus; retry UUID dan jawaban sama mengembalikan hasil tersimpan, payload berubah 409. Streak WIB, jumlah kasus selesai, dan latihan terbaru tersambung ke Academy.

GET /api/community/leaderboard dan /community/leaderboard memerlukan login, memakai pagination 10 akun USER dengan EXP > 0. Alias Guardian berbasis hash stabil menggantikan nama/email/ID. GET /api/platform/overview publik hanya memberikan hitungan investigasi URL/QR, APK, kasus layak terbit, dan tiga peringkat anonim dari MySQL. Tidak ada angka atau testimoni contoh.

Atas permintaan pengguna, **peringkat pada landing sementara memakai data contoh** yang terpisah dari API: 1. Dery Wahyu Perdana (1.250 EXP), 2. Alfian Gading Saputra (1.100 EXP), 3. Rafli Maulana (950 EXP). `components/landing/learning-leaderboard.tsx` menampilkan nama lengkap yang diminta, label **Data contoh**, dan penjelasan bahwa nama/EXP merupakan contoh. Komponen terlihat sebelum maupun sesudah login, termasuk ketika statistik platform sedang dimuat atau gagal. Tautan **Mulai belajar** menuju Academy dan mengikuti autentikasi halaman terlindungi. Data contoh tidak disimpan ke database, tidak memberi EXP/lencana, dan tidak menggantikan peringkat akun sesungguhnya pada halaman komunitas. Saat beralih ke data asli, hapus daftar contoh ini dan gunakan respons peringkat yang dianonimkan.
