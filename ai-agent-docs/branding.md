# Identitas Visual Guardian Lab

## Logo dan aset aktif

Logo resmi **Koneksi** terdiri dari dua pita saling terhubung berwarna navy `#0F172A` dan cyan `#0891B2`, tanpa teks di dalam gambar. Maskot resmi adalah **Rubah Investigator 3D** berwarna navy–krem dengan jaket cyan.

| Aset                                                                          | Pemakaian                                                                                    |
| ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `public/brand/guardian-lab-koneksi.png`                                       | Logo antarmuka dan Share Card, 512 px.                                                       |
| `app/icon.png`, `app/favicon.ico`, `app/apple-icon.png`                       | Ikon App Router yang diturunkan dari logo cyan.                                              |
| `public/brand/guardian-lab-fox.webp`                                          | Maskot 3D utama dan banner penutup, dioptimalkan untuk web.                                  |
| `public/brand/guardian-lab-fox-auth.webp`                                     | Pose auth dengan kepala/pandangan ke kiri menuju form.                                       |
| `public/landing/*.webp`                                                      | Pose rubah yang digunakan pada landing.                                                      |
| `public/guide/guardian-lab-fox-3d-guide.png`                                  | Satu gambar referensi empat sudut: depan, kiri, kanan, belakang.                             |

Gunakan [BrandIdentity dan BrandMark](../components/shared/brand-identity.tsx) untuk identitas bersama. Nama sistem tetap berupa teks yang dapat dibaca pembaca layar; gunakan `alt=""` jika nama sudah tampil di sebelah logo. `BrandMark` memakai PNG lokal agar ekspor Share Card memakai aset yang sama dengan pratinjau.

Ikon berada di root App Router sehingga metadata ikon tersedia pada seluruh halaman. Path logo dan maskot aktif dipertahankan ketika mengganti isi aset; gunakan logo dan guide di `public` sebagai referensi identitas.

## Panduan wajib generasi maskot

**Setiap permintaan generate atau edit gambar maskot wajib menggunakan [guide empat sudut ini](../public/guide/guardian-lab-fox-3d-guide.png) sebagai input gambar referensi.** Berlaku untuk pose baru, banner, ilustrasi, ekspresi, dan adegan lain. URL publik guide adalah `/guide/guardian-lab-fox-3d-guide.png`.

1. Baca panduan ini, lalu buka gambar guide dengan `view_image` atau tool pembaca gambar yang tersedia sebelum menyusun prompt.
2. Sertakan berkas guide pada input referensi tool generasi/edit gambar. Menulis path guide sebagai teks prompt saja tidak cukup. Jika tool memakai `referenced_image_paths`, isi dengan path guide yang telah diresolusikan dari root proyek.
3. Bila logo terlihat pada hasil, buka dan sertakan [logo resmi cyan](../public/brand/guardian-lab-koneksi.png) sebagai referensi gambar tambahan. Ikuti geometri dua pita Koneksi pada logo, bukan simbol rantai atau perisai pengganti.
4. Nyatakan bahwa guide merupakan identitas karakter yang harus dipertahankan. Ubah hanya pose, ekspresi, sudut kamera, atau adegan yang diminta pengguna. Pertahankan gaya render 3D dan latar transparan untuk aset potongan web.
5. Periksa hasil terhadap guide sebelum menyimpan: bentuk wajah/telinga, mata cyan, bulu navy–krem, jaket cyan, kaus putih, celana navy, telapak krem, serta ujung ekor krem. Kaca pembesar berada di tangan kanan karakter dan patch logo di dada kiri; gunakan anatomi karakter saat diputar.

Guide merupakan satu gambar berlabel **DEPAN**, **KIRI**, **KANAN**, dan **BELAKANG**. Kiri/kanan pada label mengacu arah moncong di gambar. Identitas bagian depan dan belakang tetap mengikuti anatomi yang sama. Gunakan guide sebagai referensi, bukan sebagai gambar hero atau sumber yang dipotong menjadi pose baru.

Acuan aktif untuk generasi berikutnya adalah guide ini dan logo cyan, kecuali pengguna meminta perubahan identitas secara eksplisit.

## Palet

Identitas logo, teks nama sistem, dan maskot menggunakan navy serta cyan. Token `brand-navy` dan `brand-cyan` berada pada [app/globals.css](../app/globals.css). Latar utama `#F8FAFC`, kartu putih, dan garis `#E2E8F0`.

Kontrol aplikasi menggunakan skala `brand-50` hingga `brand-950` yang tersedia pada CSS global. Merah menyampaikan error, risiko tinggi, dan aksi destruktif; amber untuk peringatan; hijau untuk hasil aman atau kelulusan. Label dan ikon menyertai warna. `ConfirmDialog` menerima tone `brand` atau `danger` sesuai tindakannya.

## Landing

Hero mengikuti [mockup 01](../hero-design-01.png) dengan skala lebih ringkas: judul navy di kiri, maskot di kanan dengan latar oval cyan, serta bar URL terpusat dan sejajar lebar komposisi. Area konten maksimal 1.040 px dan judul maksimal 70 px. Ukuran maskot dapat bertambah terpisah dari ruang layout agar bar input tetap stabil. Aset aktif `public/landing/guardian-hero-01.webp` mengikuti pose mockup, termasuk ekor besar dan tangan kiri pada tepi bar. Tubuh dan potongan tangan memakai gambar serta acuan posisi yang sama; ilustrasi tidak menerima pointer dan tidak menutup kontrol. Gunakan Bricolage Grotesque untuk display serta Geist untuk isi. Pada ponsel, teks terpusat diikuti maskot ringkas di kanan atas bar.

Lima bagian tetap: hero URL/QR → empat kartu fitur → alur penggunaan → belajar/komunitas dengan FAQ → banner penutup. Section setelah hero sejajar pada lebar maksimal 1.040 px, padding vertikal 56 px desktop/40 px ponsel, serta tinggi mengikuti isi. Palet tetap putih `#FAFCFF`, cyan pucat `#E8F8FC`, lavender `#F0EDFF`, dan kuning `#FFF6DF`. Footer landing menggunakan variant lokal; halaman APK memakai shell aplikasi.

Navbar landing, halaman informasi publik, dan halaman fitur pengguna memakai komponen bersama dengan bilah pil mengambang ringkas, wordmark tanpa subjudul, serta lebar maksimal tetap yang sama untuk tamu maupun pengguna masuk; pada layar sempit, sisakan ruang di kedua sisi. Tombol masuk memiliki tinggi visual ringkas dengan area sentuh 44 px; menu aktif menggunakan teks cyan dan garis pendek tanpa latar pil. Varian navbar hanya menentukan isi menu dan perilaku khusus landing, bukan gaya visual. Menu section tamu mengikuti posisi scroll tanpa mengubah hash; klik tautan bergerak halus dan mengikuti reduced motion. Aturan visibilitas menu mengikuti [autentikasi](./features.md#autentikasi-dan-akses).

Indikator landing mengikuti sisi bawah navbar, kosong di awal halaman dan penuh di bagian bawah. Pertahankan radius border asli dan tampilkan hanya strip bawah setinggi 5 px agar lengkungan pada kedua ujung lebih pendek tanpa bergeser dari border. Setelah scroll, tombol kembali ke atas memakai pose maskot `guardian-back-to-top` di folder aset landing; gambar melampaui lingkaran tombol dan tetap menghormati reduced motion.

- Hero **Sebelum klik, cek dulu.** mengisi tinggi layar bersama navbar, dengan ruang tambahan bila konten memerlukannya. Kolom tautan memuat tombol **Unggah QR** dan tombol kirim lingkaran yang berlabel. QR berada dalam dialog dengan judul di sebelah ikon; APK memiliki halaman tersendiri dan kartu pengenalannya tanpa label login. Keterbatasan model dijelaskan pada hasil, bukan pada hero atau dialog QR.
- Wadah `<section id="periksa">` dan skeleton harus konsisten pada SSR serta render client pertama. Dialog mula-mula tertutup; pembukaan berbasis query dan animasi mengikuti hydration. Jangan menyimpulkan masalah cache dev sudah selesai tanpa verifikasi runtime.
- Fitur memakai kartu mendatar 2×2 dengan maskot di kanan; alur penggunaan memakai tiga ilustrasi langkah. Panel Academy dan komunitas memiliki pose masing-masing, diikuti statistik API ringkas dan empat FAQ. CTA penutup lebih pendek dengan maskot menunjuk ke tombol. Enam pose baru memakai nama aset `guardian-apk-inspector`, `guardian-input-guide`, `guardian-evidence-reader`, `guardian-academy-reader`, `guardian-community-helper`, dan `guardian-cta-guide` di folder landing. Maskot tetap overflow: pisahkan permukaan kartu dari ilustrasi dan sisakan ruang agar tidak menutupi kontrol atau keluar viewport.
- Gunakan static import `next/image`; hanya maskot hero eager/prioritas tinggi dan gambar section lain lazy. Motion memakai `LazyMotion` dan `MotionConfig reducedMotion="user"`: cursor maksimal 8 px horizontal/6 px vertikal/0,6° dan parallax 24 px hanya pada dekorasi belakang hero. Maskot dan form tetap diam agar tangan menempel; preferensi reduced motion dipantau dan cursor effect hanya pointer presisi. Reveal ilustrasi section lain memakai 350 ms/12 px sekali masuk viewport; hover kartu menggerakkan keseluruhan kartu agar ilustrasi tetap menyatu.

Perilaku URL/QR, APK, login, dan pemulihan input berada di [kontrak input](./features.md#input-url-qr-dan-apk). Navigasi memakai pembentuk URL dari [rute](./routes-and-navigation.md). Skenario QA berada di [TEST_PLAN.md](../TEST_PLAN.md).

## Autentikasi

Layout auth memenuhi satu viewport dinamis tanpa margin luar atau scroll: form putih di kiri, panel navy–cyan sampai tepi layar di kanan. Judul sambutan dilengkapi satu kalimat subjudul; tanpa badge keamanan, footer, atau tombol kembali di pojok. Display memakai Bricolage Grotesque; field berlatar tipis tanpa ikon awal, dengan toggle password. Pose `public/brand/guardian-lab-fox-auth.webp` melampaui batas panel dengan pandangan ke kiri menuju form. Pisahkan latar dan gambar; framing desktop sedikit bergeser ke kanan dan diperbesar. Panel memakai cahaya lembut, pola grid, serta watermark logo Koneksi bertonal rendah di kanan; hindari ikon kilau, bola, dan garis orbit. Pada ponsel portrait, ilustrasi ringkas berada di pojok kanan atas tanpa watermark; viewport pendek memakai field registrasi dua kolom, lalu tiga kolom untuk tiga field awal pada layar sangat pendek. Logo dan ilustrasi ponsel dapat disembunyikan saat ruang sangat pendek agar kontrol tetap muat, termasuk ketika keyboard terbuka. Gunakan static import `next/image`. Kontrak pemulihan akses ada pada [fitur autentikasi](./features.md#autentikasi-dan-akses).
