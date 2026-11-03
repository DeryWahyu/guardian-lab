# Tahap 4 — Hasil dan Riwayat dari Rekaman yang Sama

## Sumber data dan tautan hasil

Landing, detail riwayat, dan daftar riwayat membaca `ForensicRecord` melalui DTO yang sama. Setelah input tersimpan, landing mencantumkan `?investigation=<id>&tab=<jenis>` pada URL. Hasil dibaca kembali dari endpoint detail; halaman tidak menyimpan salinan hasil atau menghitung skor sendiri.

Reload, Back/Forward, atau pembukaan ulang tautan hasil mengambil rekaman yang sama. `?mode=geek` mempertahankan mode teknis ketika berpindah dari landing ke detail. Mengubah input membersihkan hasil dari tampilan, tanpa menghapus rekamannya di database.

Identitas dan peran tetap diperiksa dari sesi database. USER hanya dapat membaca rekamannya sendiri, sementara ADMIN dapat meninjau semua rekaman. Tautan hasil tidak memberikan akses publik. Setelah sesi berakhir, tampilan menghapus data yang telah dimuat dan menawarkan login; USER dapat kembali ke landing dengan ID hasil yang diminta.

Implementasi utama:

- [DTO dan serialisasi](../lib/investigations/serialize.ts)
- [Pembaca data client](../lib/hooks/use-api-resource.ts) dan [hook investigasi](../lib/hooks/use-investigation.ts)
- [Area investigasi landing](../components/landing/landing-investigation.tsx), dibungkus Suspense terpisah dari konten landing statis
- [Tampilan investigasi bersama](../components/shared/investigation-view.tsx)

## Status dan bukti yang jujur

`RECEIVED` dan `PROCESSING` diperiksa ulang setiap tiga detik selama halaman terlihat. Pembaruan berhenti pada status terminal. Fokus ulang halaman dan tombol **Perbarui status** melakukan GET terbaru, tanpa membuat investigasi atau memulai analisis ulang.

Model masih belum terhubung. Input baru tetap menghasilkan `UNAVAILABLE` dengan risiko `null`; tidak ada antrean atau pemrosesan ulang otomatis untuk rekaman ini.

Tampilan hasil lengkap memerlukan status `COMPLETED`, sumber dan versi model, skor valid 0–100, kategori, ringkasan, serta struktur bukti yang valid. Skor `0` yang tersimpan tetap ditampilkan. Warna dan label mengikuti `riskLevel` tersimpan, bukan tebakan dari ambang skor.

- `LEGACY_UNVERIFIED` tampil sebagai **Rekaman lama**, tanpa mempresentasikan skor lamanya sebagai hasil terverifikasi.
- `COMPLETED` yang belum memiliki data lengkap tampil sebagai **Hasil belum lengkap**.
- Mode manusia memakai ringkasan dan temuan tersimpan. Judul penipuan tidak ditambahkan ketika tidak ada temuan yang mendukungnya.
- Mode teknis hanya memuat atribut bukti yang benar-benar tersimpan. Tidak ada entropy bawaan, C2 rekaan, keterangan token bersih, atau tebakan infrastruktur ketika datanya tidak ada. Bukti dapat dicari dan discroll.
- ID, jenis input, waktu penerimaan/perubahan/proses, sumber analisis, dan versi model disajikan pada kedua mode.

Serialisasi membatasi field respons dan tidak mengirim relasi nama/email akun. Data legacy juga melewati penyamaran PII saat dibaca; proses baca tidak mengubah baris asal.

## Riwayat dengan pagination dan filter

`GET /api/history` kini mengembalikan envelope, menggantikan respons array lama:

```json
{
  "records": [],
  "pagination": { "page": 1, "pageSize": 12, "total": 0, "totalPages": 1 },
  "summary": { "total": 0, "highRisk": 0, "unavailable": 0, "processing": 0, "failed": 0 }
}
```

Parameter API: `type`, `risk`, `status`, `search`, `from`, `to`, `page`, dan `pageSize`. Halaman dimulai dari 1, ukuran default 12, maksimal 50. Hasil diurutkan berdasarkan `createdAt` lalu `id` secara menurun. Filter diterapkan sebelum pagination.

`from` dan `to` pada API merupakan ISO datetime UTC. Kontrol tanggal pada UI menggunakan hari kalender lokal pengguna, lalu mengirim batas awal/akhir hari sebagai UTC. Rentang terbalik, tanggal tidak valid, halaman negatif, serta ukuran halaman berlebihan ditolak.

Total dan ringkasan dihitung dari seluruh rekaman yang sesuai filter, bukan hanya halaman aktif. Filter risiko dan hitungan risiko tinggi hanya menggunakan hasil lengkap yang memiliki sumber/versi; laporan lama atau hasil parsial tidak diperlakukan sebagai penilaian risiko terverifikasi. Pembacaan halaman dan agregasi menggunakan transaksi MySQL `RepeatableRead` agar berasal dari satu snapshot.

Filter tersinkron dengan URL; perubahan filter mengembalikan halaman ke 1. Pencarian diberi jeda 250 ms untuk mengurangi request saat mengetik. Pembaca data membatalkan permintaan lama dan hanya menerima hasil yang cocok dengan ID/query aktif. Statistik menampilkan placeholder saat belum diketahui, bukan angka nol buatan.

## Loading dan kegagalan

Skeleton mengikuti struktur metadata/laporan. Kondisi akun belum memiliki investigasi dibedakan dari filter tanpa hasil dan halaman di luar rentang.

- `401`: sesi berakhir, tampilkan login.
- `403`: akses tidak diizinkan, jangan tampilkan target/hasil.
- `404`: rekaman tidak ditemukan.
- `400`: ID/filter tidak valid, arahkan untuk memperbaiki atau menghapus filter.
- Gangguan server/jaringan: sediakan retry GET. Jika snapshot lama masih tersedia, tandai dengan jelas sebagai data terakhir.
- JSON atau bentuk data tidak sesuai: jangan membuat hasil pengganti dan jangan mempresentasikan data lama sebagai respons baru.

Permintaan baca memiliki batas waktu 15 detik per request, dengan AbortController baru pada setiap refresh. Setelah timeout, retry atau fokus kembali dapat memulai request baru. Permintaan dan timer dibatalkan saat ID, filter, akun/peran, atau komponen berubah. Data dari sesi sebelumnya tidak dipakai kembali pada scope akun/peran yang berbeda.

## Pengujian

Guardian Share Card menggunakan ID dari hasil tersimpan, tanpa menyalin target/temuan ke query. Kontrak ekspor, gating hasil, dan fallback berbagi dijelaskan di [share-card.md](./share-card.md).

Uji MySQL mencakup pagination tanpa duplikasi, total/agregasi, filter tanggal/jenis/status/risiko, akses owner/admin, DTO identik di list/detail, perlindungan legacy saat baca, serta ID/query yang tidak valid. Uji render memeriksa skor nol, verdict tersimpan, bukti kosong tanpa klaim rekaan, dan gating hasil parsial/legacy. Pengujian browser memakai hasil fixture terkontrol untuk perubahan status; fixture tersebut bukan keluaran model aktif.

Audit manual microinteractions: **10/10**, delapan diagnostik terpenuhi. Tindakan/status terlihat, aturan refresh konsisten, loading langsung, pesan error sesuai kondisi, polling berhenti pada hasil akhir, mode terlihat, serta filter dan navigasi dapat digunakan dengan keyboard. Tidak ada baris diagnostik gagal. Hasil pemeriksaan aktual ada di [TEST_READY.md](../TEST_READY.md).
