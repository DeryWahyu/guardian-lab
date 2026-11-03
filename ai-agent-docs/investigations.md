# Rekaman Investigasi Terpusat

Tahap 2 pada urutan kerja sambil menunggu pelatihan model. Kontrak aplikasi ini terpisah dari kontrak input/output model yang akan disepakati setelah model siap.

## Sumber data

`ForensicRecord` tetap menjadi satu sumber data untuk investigasi. Tidak ada tabel riwayat atau ID hasil sementara yang terpisah. ID, pemilik sesi, jenis input, status, metadata input, bukti teknis, hasil, sumber analisis, versi model, alasan kegagalan, dan waktu proses tersimpan di database.

Implementasi: [service](../lib/investigations/service.ts), [validasi dan DTO](../lib/validations/investigation.ts), serta [skema database](../prisma/schema.prisma).

| Status        | Arti                                | Transisi berikutnya                   |
| ------------- | ----------------------------------- | ------------------------------------- |
| `RECEIVED`    | Input diterima                      | `PROCESSING`, `FAILED`, `UNAVAILABLE` |
| `PROCESSING`  | Worker sedang memeriksa             | `COMPLETED`, `FAILED`, `UNAVAILABLE`  |
| `COMPLETED`   | Hasil tervalidasi tersimpan         | Terminal                              |
| `FAILED`      | Pemeriksaan gagal, alasan tersimpan | Terminal                              |
| `UNAVAILABLE` | Layanan/model belum tersedia        | Terminal                              |

Perubahan status menggunakan kondisi status sebelumnya dan pemilik pada operasi database atomik. Penyelesaian memerlukan skor valid, ringkasan, bukti, sumber analisis, dan versi model. Operasi perubahan status hanya tersedia untuk kode server internal; pengguna tidak dapat mengirim status, pemilik, atau hasil sendiri melalui API publik.

`riskLevel`, `riskScore`, `scamCategory`, dan `summary` bernilai `null` sebelum ada hasil. Nilai `0` bukan pengganti hasil yang belum tersedia. `startedAt` hanya terisi saat proses dimulai; `finishedAt` mencatat berakhirnya proses termasuk kegagalan/ketidaktersediaan.

## Alur API saat model belum tersedia

Tahap 4 menambahkan tautan hasil berdasarkan ID, pembacaan hasil bersama, pemantauan status, serta pagination/agregasi riwayat. Kontrak respons riwayat terbaru berupa envelope `records`, `pagination`, dan `summary`; rujuk [results-and-history.md](./results-and-history.md).

Validasi URL/QR, normalisasi HTTPS, drag-and-drop, batas byte request, dan pemulihan form diperinci dalam [input-flow.md](./input-flow.md). Sumber validasi input berada di `lib/validations/analysis-input.ts`.

1. Autentikasi dan validasi input.
2. Samarkan PII, hapus kredensial URL, dan tutupi seluruh nilai query serta fragment sebelum persistensi. Target tersimpan merupakan representasi yang disanitasi, sehingga URL asli yang mengandung nilai tersebut perlu dimasukkan ulang untuk pemeriksaan lanjutan.
3. URL/QR menyimpan `RECEIVED`, lalu `UNAVAILABLE` beserta alasan `MODEL_NOT_CONFIGURED` dalam satu transaksi. APK bergerak melalui `PROCESSING` untuk ekstraksi statis tahap 7, lalu menyimpan laporan dan `UNAVAILABLE` secara atomik atau mencatat `FAILED`; rujuk [apk-static.md](./apk-static.md).
4. Respons `201` menyatakan rekaman berhasil dibuat, bukan analisis sudah selesai. Kegagalan persistensi menghasilkan `500` tanpa ID sukses.
5. Landing, daftar/detail riwayat, dan dashboard admin membaca ID serta status yang sama. Share Card hanya membuka hasil yang selesai dan memiliki sumber/versi; target dari query saja tidak menghasilkan peringatan buatan.

| Endpoint                | Input                                                                   | Hasil                                                                                |
| ----------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `POST /api/analyze-url` | JSON `{ "url": "https://example.test" }`                                | Rekaman jenis `URL`, `201`                                                           |
| `POST /api/analyze-qr`  | Gambar multipart `file`/`image`, atau JSON `imageBase64` dan `mimeType` | QR dibaca dari piksel asli, jenis tetap `QR`, `201`; tidak membuat rekaman URL kedua |
| `POST /api/analyze-apk` | Multipart `file`, `.apk`, tidak kosong, maksimal 50 MB                  | Jenis `APK`, SHA-256 dan ukuran berkas, `201`                                        |
| `GET /api/history`      | Filter `type`, `risk`, `status`, `search`                               | Halaman berisi maksimal 50 rekaman, total, serta ringkasan sesuai filter             |
| `GET /api/history/:id`  | ID investigasi tersimpan                                                | Detail yang sama; hanya pemilik atau admin                                           |

QR tidak terbaca atau berisi selain URL HTTP/HTTPS disimpan sebagai `FAILED` dan dikembalikan dengan `422` serta ID. Isi non-URL tidak disimpan, untuk menghindari penyimpanan kredensial Wi-Fi. Gambar maksimal 5 MB dengan batas raster 16 juta piksel. Gambar uji satu piksel tidak pernah dipetakan ke tautan phishing.

APK didekompilasi secara statis melalui JADX pada tahap 7. `inputMetadata.binaryStored` tetap `false`, sedangkan `staticExtractionPerformed` bernilai `true` jika laporan berhasil disimpan di `inputMetadata.apkStatic`. Laporan memuat fakta dari berkas tanpa menyimpulkan risiko AI; nama berkas tidak dipakai untuk menebak permissions, bot, C2, atau skor. Pemeriksaan ulang yang memerlukan binary membutuhkan unggahan baru.

Semua endpoint membaca identitas dari sesi database. Riwayat bersifat `private, no-store`. Integrasi model, antrean worker, penyimpanan berkas, dan fitur proses ulang belum dibuat; rekaman `UNAVAILABLE` tidak diproses otomatis.

## Migrasi dan pengujian

Migrasi `20261101090000_investigation_lifecycle` menambah kolom tanpa reset. Laporan lama dipertahankan sebagai `COMPLETED` dengan sumber `LEGACY_UNVERIFIED`, metadata kosong, serta waktu akhir sesuai waktu pembuatan. Tampilan menandainya sebagai rekaman lama, tidak menampilkannya sebagai hasil model terverifikasi.

`tests/investigations/lifecycle.test.ts` memeriksa transisi, kepemilikan, persaingan update, validasi hasil, sanitasi, persistensi gagal pada MySQL nyata, konsistensi detail, filter status, unggahan aktual, QR non-URL/satu piksel, dan preservasi data saat SQL migrasi diterapkan. Seluruh pengujian database berjalan di database uji terisolasi.

Fixture QR dibuat menggunakan `qrcode` sebagai dependensi pengembangan. Decoder produksi hanya memakai `sharp` dan `jsqr`. Helper leksikal/DeepSeek lama tidak dipanggil endpoint investigasi selama integrasi model ditunda.
