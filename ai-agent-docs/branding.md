# Identitas Guardian Lab

Logo resmi adalah **Koneksi**, desain keempat dari eksplorasi putaran ketiga yang dipilih pengguna pada 2 November 2026. Dua pita yang saling terhubung menggunakan navy `#0F172A` dan teal `#0F766E`, tanpa teks di dalam gambar. Identitas ini menggantikan GL Proteksi.

- `design/guardian-lab-logo-source.png`: gambar pilihan Koneksi asli sebelum penyesuaian warna.
- `design/guardian-lab-logo.png`: master PNG transparan dari desain terpilih.
- `public/brand/guardian-lab-koneksi.png`: aset transparan 512 px untuk antarmuka dan Share Card. Nama berkas baru mencegah pemakaian logo GL lama dari cache browser.
- `app/favicon.ico`: favicon ICO dengan empat ukuran untuk browser.
- `app/icon.png`: ikon PNG 256 px transparan dengan margin 4 px; logo diperbesar menjadi maksimal 248 px sesuai permintaan pengguna. Favicon ICO diturunkan dari ikon ini.
- `app/apple-icon.png`: ikon Apple 180 px dengan latar putih.

Gunakan `BrandIdentity` dari `components/shared/brand-identity.tsx` untuk logo beserta nama sistem dan subjudul opsional. Gunakan `BrandMark` untuk ikon saja. Ukuran diatur melalui `className`; prop `alt=""` digunakan ketika nama sistem sudah tersedia di sebelah ikon.

Header/footer umum, login/registrasi, sidebar admin, dialog autentikasi, dan Share Card memakai komponen yang sama. Nama sistem di sebelah logo tetap berupa teks antarmuka dengan warna navy/teal agar dapat dibaca pembaca layar. Ikon keamanan fungsional tetap menggunakan Lucide sesuai maknanya.

## Palet antarmuka global

Seluruh antarmuka menggunakan token terpusat pada `app/globals.css`: navy `#0F172A` untuk teks utama, teal `#0F766E` untuk aksi utama, latar `#F8FAFC`, kartu putih, dan garis `#E2E8F0`. Utilitas `brand-50` sampai `brand-950` menyediakan tint, focus ring, hover, pilihan aktif, dan keadaan disabled yang konsisten. Warna ilustrasi maskot mengikuti navy/teal.

Warna semantik tetap terpisah: merah untuk error, penolakan, risiko tinggi, dan aksi destruktif; amber untuk peringatan atau latihan belum lulus; hijau untuk hasil aman/kelulusan. Label serta ikon tetap menyampaikan arti status. `ConfirmDialog` menerima tone `brand` untuk persetujuan dan `danger` untuk penolakan/penghapusan. Input auth yang tidak valid mempertahankan penanda error merah saat fokus.

File ikon berada di root App Router sehingga Next.js otomatis menyertakan metadata ikon pada seluruh halaman, termasuk halaman admin dan autentikasi. Tidak perlu menduplikasi konfigurasi ikon pada setiap halaman. `BrandMark` memakai PNG lokal tanpa optimasi dinamis agar ekspor `html-to-image` memakai aset yang sama dengan pratinjau.

Master transparan disiapkan dengan imagegen bawaan: bentuk Koneksi dipertahankan, warna rose diganti teal, dan latar dihapus. Sharp digunakan untuk pemangkasan margin serta ukuran turunan; favicon ICO dikonversi dengan png-to-ico 3.0.2. Prompt produksi disimpan di [design/logo-prompts.md](../design/logo-prompts.md).

## Maskot hero Gateway

Hero Gateway menggunakan **Rubah Investigator** pilihan pengguna. Logo Koneksi resmi ditempatkan pada patch putih kecil di jaket teal; rubah membawa kaca pembesar sebagai atribut pemeriksaan. Master transparan berada di `design/guardian-lab-fox-mascot.png`, sedangkan aset web terpangkas dan terkompresi berada di `public/brand/guardian-lab-fox.webp`. Prompt edit menggunakan imagegen bawaan disimpan di [design/guardian-lab-fox-prompt.md](../design/guardian-lab-fox-prompt.md).

Redesign terbaru 3 November 2026 menggunakan kembali maskot asli yang berdiri, sesuai pilihan pengguna: `public/brand/guardian-lab-fox.webp` dari master `design/guardian-lab-fox-mascot.png`. Hero memakai judul “Sebelum klik, cek dulu.”, palet global navy/teal, dan form sederhana. Container mengikuti header serta bagian lain: maksimal 1280 px dengan padding responsif 16/24/32 px. Versi maskot bertumpu pada form, prompt koreksi logo, dan desain referensi sebelumnya dipertahankan sebagai arsip; aset tersebut tidak digunakan pada hero aktif.

`HeroSection` membungkus pengantar, maskot, dan `AnalysisGateway`. Pada desktop, maskot berada di kolom tersendiri; pada ponsel, maskot kecil mendampingi pengantar dan form memakai lebar penuh. `GatewaySkeleton` mempertahankan susunan kartu. Hasil pemeriksaan tetap tampil sesudah hero; tab URL, autentikasi, dan ID riwayat memakai alur sebelumnya. Hero menggunakan `next/image` dengan ukuran responsif dan pemuatan eager, tanpa animasi dekoratif. Detail komposisi, tombol Tempel, dan status model: [hero-reference.md](./hero-reference.md).
