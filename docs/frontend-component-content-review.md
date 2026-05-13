# Frontend Component and Content Review

Dokumen ini merangkum komponen, route, data demo, dan isi konten frontend Ngantri saat ini. Tujuannya sebagai bahan review sebelum desain, copywriting, UX flow, dan integrasi API di-improve.

## Ringkasan Produk

Ngantri adalah SaaS antrean dan reservasi online untuk UMKM jasa di Indonesia. Positioning utama yang dipakai di UI adalah:

- Nama produk: `Ngantri`
- Tagline: `Datang pas giliranmu.`
- Value proposition: pelanggan bisa melihat antrean realtime, estimasi waktu, dan booking online tanpa perlu install aplikasi.
- Contoh bisnis utama: `Barber Adi`
- Segmentasi contoh: barbershop, bengkel, dokter gigi, salon.

## Teknologi UI

- Framework: Next.js App Router.
- Bahasa: TypeScript dan React.
- Styling: Tailwind CSS dengan warna dominan `#F9FAFB`, `slate`, `blue-600`, `emerald`, `amber/orange`, dan beberapa aksen `rose/violet`.
- Komponen UI dasar: shadcn-style `Button`, `Card`, `CardContent`, `Badge`, `Tabs`.
- Ikon: `lucide-react`.
- Animasi landing page: `framer-motion`.
- Data client demo: TanStack Query melalui `Providers`.

## Layout Global

File: `frontend/app/layout.tsx`

Fungsi:

- Mengatur metadata utama website.
- Mengatur bahasa HTML ke `id`.
- Membungkus semua halaman dengan `Providers`.

Konten metadata:

- Default title: `Ngantri - Datang pas giliranmu`
- Template title: `%s | Ngantri`
- Description: `Ngantri membantu UMKM jasa menampilkan antrean realtime, estimasi waktu, reservasi online, dan halaman antrean publik.`
- Keywords: `Ngantri`, `antrean online`, `reservasi online`, `queue management`, `UMKM Indonesia`, `barbershop`, `klinik`, `bengkel`, `salon`
- OpenGraph dan Twitter memakai pesan: `Queue management dan reservasi online untuk UMKM jasa Indonesia.`
- Theme color: `#2563EB`

## Provider Client

File: `frontend/app/providers.tsx`

Komponen: `Providers`

Fungsi:

- Menyediakan `QueryClientProvider` untuk TanStack Query.
- Default query config:
  - `staleTime`: 30 detik.
  - `refetchOnWindowFocus`: false.

Catatan review:

- Provider sudah cocok untuk demo data dan MVP awal.
- Nanti bisa ditambah auth/session provider jika integrasi login sudah aktif.

## Komponen Brand

File: `frontend/components/ngantri/logo.tsx`

Komponen: `NgantriLogo`

Props:

- `className`: class tambahan untuk wrapper.
- `iconClassName`: class tambahan untuk image logo.

Isi dan perilaku:

- Render elemen `span` inline-flex.
- Memakai `next/image`.
- Asset logo: `/brand/ngantri-logo-mark.png`
- Alt text: `Ngantri`
- Ukuran default icon: `size-10`, bisa dioverride via `iconClassName`.
- Image diberi `priority`.

Dipakai di:

- Landing page navbar dan footer.
- Pricing page.
- Auth card.
- Dashboard sidebar.

Catatan review:

- Komponen saat ini hanya menampilkan logo mark, bukan wordmark. Di beberapa tempat footer menambahkan teks `Ngantri` manual.
- Jika brand butuh konsisten, bisa ditambah varian `showText`.

## Komponen Auth

File: `frontend/components/ngantri/auth-card.tsx`

Komponen: `AuthCard`

Props:

- `mode`: `login` atau `register`.

Dependensi:

- `react-hook-form`
- `NgantriLogo`
- `Button`
- `Card`, `CardContent`
- Type validation: `LoginInput`, `RegisterInput`

Isi konten mode login:

- Heading: `Masuk ke Ngantri`
- Subcopy: `Kelola antrean, booking, dan cabang dari satu tempat.`
- Field:
  - Email, placeholder `owner@barberadi.test`
  - Password, placeholder `Minimal 8 karakter`
- Primary CTA: `Masuk`
- Secondary CTA: `Continue with Google`
- Link placeholder: `Forgot password placeholder`

Isi konten mode register:

- Heading: `Daftar Ngantri`
- Subcopy sama seperti login.
- Field:
  - Nama, placeholder `Adi Owner`
  - Email
  - Password
- Primary CTA: `Daftar`
- Secondary CTA: `Continue with Google`
- Link placeholder: `Forgot password placeholder`

Route yang memakai:

- `/login`: `<AuthCard mode="login" />`
- `/register`: `<AuthCard mode="register" />`

Catatan review:

- Submit handler masih placeholder `() => undefined`.
- Belum menampilkan error validation walaupun tipe input sudah disiapkan.
- Copy tombol Google masih bahasa Inggris, bisa diseragamkan menjadi Indonesia.
- Forgot password masih placeholder.

## Komponen Dashboard Shell

File: `frontend/components/ngantri/dashboard-shell.tsx`

Komponen: `DashboardShell`

Props:

- `title`: judul halaman.
- `description`: deskripsi pendek halaman.
- `children`: konten utama.

Struktur:

- `main` full screen dengan background `#F9FAFB`.
- Sidebar fixed di desktop `lg`, lebar `w-72`, hidden di mobile.
- Header sticky dengan judul, deskripsi, dan tombol `Ambil Nomor`.
- Content container dengan padding responsif.

Navigasi sidebar:

- `Overview` -> `/dashboard`
- `Live Queue` -> `/dashboard/queues`
- `Bookings` -> `/dashboard/bookings`
- `Branches` -> `/dashboard/branches`
- `Staff` -> `/dashboard/staff`
- `Services` -> `/dashboard/services`
- `Customers` -> `/dashboard/customers`
- `Theme` -> `/dashboard/theme`
- `QR Code` -> `/dashboard/qr`
- `Analytics` -> `/dashboard/analytics`
- `Subscription` -> `/dashboard/subscription`
- `Settings` -> `/dashboard/settings`

Dipakai di:

- `/dashboard`
- `/dashboard/queues`
- Semua route dashboard lain yang sementara re-export ke queues.
- `/admin`
- Semua route admin turunan yang sementara re-export ke admin.

Catatan review:

- Belum ada active state berdasarkan route.
- Sidebar hidden di mobile, belum ada mobile navigation.
- Tombol `Ambil Nomor` belum memiliki action.

## Komponen Metric Card

File: `frontend/components/ngantri/metric-card.tsx`

Komponen: `MetricCard`

Props:

- `icon`: Lucide icon.
- `label`: label metrik.
- `value`: angka atau teks.
- `tone`: `blue`, `orange`, `green`, `red`, `slate`. Default `blue`.

Isi:

- Card putih rounded.
- Icon dalam kotak warna sesuai tone.
- Label kecil warna slate.
- Value besar dan bold.

Dipakai di:

- Dashboard overview.
- SaaS admin overview.

## Komponen Live Queue Board

File: `frontend/components/ngantri/live-queue-board.tsx`

Komponen: `StaffLaneQueueBoard`

Props:

- `staff`: array `BranchStaff`.
- `queues`: array `QueueItem`.

Cara kerja:

- Membuat satu card per staff.
- Queue difilter berdasarkan `staffId`.
- Queue status `serving` ditampilkan sebagai nomor yang sedang dilayani.
- Queue status `waiting` ditampilkan sebagai list antrean berikutnya.
- Jika tidak ada waiting queue, tampil pesan `Belum ada antrean`.

Isi tiap lane:

- Nama staff.
- Role staff.
- Badge status:
  - `Aktif` jika `isAvailable`.
  - `Istirahat` jika tidak available.
- Panel `Serving` dengan nomor antrean, fallback `-`.
- Waiting queue: nomor antrean dan estimasi menit.
- CTA: `Panggil Berikutnya`.

Dipakai di:

- Dashboard overview.
- Dashboard live queue.
- Public business page.

Catatan review:

- Tombol `Panggil Berikutnya` belum punya handler.
- Belum ada aksi `skip`, `complete`, atau `no_show` walaupun status domain sudah tersedia.
- Public page ikut menampilkan tombol admin `Panggil Berikutnya`, perlu dipisahkan mode customer/admin.

## Komponen Public Business

File: `frontend/components/ngantri/public-business.tsx`

Komponen: `PublicBusinessPage`

Props:

- `branchSlug` optional.

Data:

- Mengambil data dari `useDemoPublicBusiness`.
- Jika `branchSlug` cocok, pakai cabang tersebut.
- Jika tidak ada slug atau tidak cocok, fallback ke cabang pertama.
- Queue difilter berdasarkan `branch.id`.

Isi halaman:

- Hero biru dengan badge `Live`.
- Judul bisnis dari data, saat ini `Barber Adi`.
- Subcopy: `Datang pas giliranmu. Cek antrean realtime dan ambil nomor dari HP.`
- Summary card:
  - Cabang: nama branch aktif.
  - Sekarang Dilayani: `A-01`.
  - Estimasi: `18 menit`.
- Main queue board memakai `StaffLaneQueueBoard`.
- Sidebar layanan:
  - Icon gunting.
  - Heading `Pilih layanan`.
  - List service dari demo data, menampilkan nama, durasi menit, dan harga.
  - CTA `Ambil Nomor`.
  - CTA outline `Booking Online`.
  - Info QR: `QR cabang siap dicetak dari dashboard.`

Route yang memakai:

- `/{businessSlug}`: render tanpa branch slug.
- `/{businessSlug}/{branchSlug}`: render dengan branch slug.

Catatan review:

- `businessSlug` belum dipakai untuk filter data.
- Info `Sekarang Dilayani` masih hardcoded `A-01`.
- CTA belum mengarah ke flow booking atau create queue.
- Perlu mode tampilan publik yang tidak memunculkan action admin.

## Landing Page

File: `frontend/app/page.tsx`

Route: `/`

Komponen utama:

- `Navbar`
- `HeroSection`
- `BeforeAfterSection`
- `ModulesSection`
- `BusinessSection`
- `PublicPageSection`
- `SettingsSection`
- `WhatsAppSection`
- `PricingSection`
- `FinalCta`
- `Footer`

Karakter desain:

- Editorial landing page dengan banyak mockup operasional.
- Banyak rounded card besar, shadow halus, badge, dan micro-animation.
- Tone brand: friendly, lokal, dan fokus UMKM.

### Navbar

Isi:

- Logo Ngantri.
- Link desktop:
  - `Cerita` -> `#cerita`
  - `Fitur` -> `#fitur`
  - `Harga` -> `#harga`
- CTA: `Coba Gratis`

Catatan review:

- CTA belum pakai `Link`.
- Nav mobile hanya menampilkan logo dan CTA, tanpa menu.

### Hero Section

Isi copy:

- Badge: `Live antrean untuk UMKM jasa`
- H1: `Antrian yang bikin pelanggan datang pas waktunya.`
- Paragraph: `Ngantri bantu UMKM jasa menampilkan antrean realtime, estimasi waktu, dan reservasi online tanpa aplikasi ribet.`
- CTA primary: `Coba Ngantri Gratis`
- CTA secondary: `Lihat Demo Antrian`
- Alur pelanggan:
  - `Ambil nomor`
  - `Tunggu di rumah`
  - `Berangkat`
  - `Dilayani`
- Status kecil: `Lebih tenang`

Mockup:

- Floating ticket:
  - `A-14`, `Masuk 2 lagi`
  - `B-03`, `Reservasi 14.30`
  - `C-21`, `Sudah check-in`
- Live queue board:
  - Bisnis: `Barber Adi, Tebet`
  - Judul: `Papan antrean`
  - Badge: `Live`
  - Sekarang dilayani: `A-12`, `Kursi 2`
  - Nomor kamu: `A-16`, `3 lagi`
  - Metric: `Estimasi datang` = `18 menit`
  - Metric: `Sisa antrean` = `3 antrean lagi`
- Phone mockup:
  - URL: `ngantri.id/barber-adi`
  - Bisnis: `Barber Adi`
  - Status: `Buka sampai 21.00`
  - Nomor kamu: `A-16`
  - Estimasi: `Datang sekitar 18 menit lagi`
  - Queue list: `A-13`, `A-14`, `A-15`
  - CTA: `Ambil nomor`

### Before After Section

Section intro:

- Eyebrow: `Sebelum vs Sesudah Ngantri`
- Title: `Dari 'masih lama?' jadi tahu kapan harus berangkat.`
- Text: `Pelanggan nggak perlu menunggu tanpa kepastian. Bisnis juga nggak perlu balas chat antrean satu-satu.`

Sebelum card:

- Badge: `Sebelum`
- Title: `Antrian manual bikin pelanggan dan admin sama-sama capek.`
- Status: `Tidak pasti`
- Chat:
  - `Mas, masih lama?`
  - `Sebentar ya kak, saya cek dulu.`
  - `Kalau datang sekarang aman nggak?`
- Notes:
  - `Catatan meja`: `A-13? A-14? booking jam 11.00`
  - `Tumpang tindih`: `Booking dobel karena catatan manual.`
- Warnings:
  - `Datang langsung, ternyata masih 8 orang.`
  - `Admin bolak-balik cek urutan dan balas chat.`

Connector:

- `Dari nebak-nebak`
- `jadi pasti`

Sesudah card:

- Badge: `Sesudah`
- Title: `Semua orang tahu posisi antrean, estimasi waktu, dan kapan harus datang.`
- Status: `Realtime & jelas`
- Mockup:
  - Nomor kamu `A-16`
  - Sekarang dilayani `A-13`
  - `3 antrean lagi`
  - `18 menit`
  - Message: `Silakan berangkat sekarang`
- Tiles:
  - `Estimasi datang`: `18 menit`
  - `Pesan otomatis`: `Berangkat sekarang`

### Modules Section

Section intro:

- Eyebrow: `Bukan cuma nomor antrean`
- Title: `Sistem kecil yang terasa hidup di meja admin.`
- Text: `Setiap modul dibuat untuk kebiasaan operasional UMKM: cepat dilihat, mudah diubah, dan jelas untuk pelanggan.`

Module cards:

- `Live Queue`: `Nomor aktif, sisa antrean, dan status layanan tampil realtime.` Tag `Realtime`.
- `Estimasi Waktu`: `Durasi tiap layanan menyesuaikan jam operasional dan kondisi antrean.` Tag `Dinamis`.
- `Reservasi Online`: `Pelanggan ambil nomor dari rumah tanpa install aplikasi.` Tag `Praktis`.
- `Halaman Bisnis`: `Mini website antrean dengan warna dan info bisnis sendiri.` Tag `Profesional`.
- `Notifikasi WhatsApp-style`: `Pesan otomatis saat nomor makin dekat dengan giliran.` Tag `Familiar`.
- `Multi Staff`: `Pisahkan antrean per kursi, mekanik, dokter, atau counter.` Tag `Fleksibel`.
- `Analytics Sederhana`: `Lihat jam ramai, rata-rata tunggu, dan layanan favorit.` Tag `Berguna`.

Promise row:

- `Ringan & cepat`: `Tampilan realtime`
- `Mudah digunakan`: `Tanpa pelatihan rumit`
- `Aman & stabil`: `Data bisnis terjaga`
- `Dibuat untuk UMKM`: `Harga terjangkau`

### Business Section

Section intro:

- Eyebrow: `Untuk bisnis kecil yang sibuk`
- Title: `Beda layanan, beda ritme antreannya.`
- Text: `Ngantri mengikuti cara kerja bisnis jasa lokal, dari kursi barber sampai bay bengkel.`

Hero card:

- Badge: `Ritme hari ini`
- Title: `Satu sistem, banyak tempo kerja.`
- Text: `Kursi barber bisa cepat, treatment salon bisa panjang, bengkel bisa ramai sore. Ngantri menjaga estimasi tetap masuk akal untuk tiap layanan.`

Business examples:

- Barbershop:
  - Service: `Potong 20 menit`
  - Queue: `A-16 siap 18 menit lagi`
  - Rhythm: `Cepat, kursi bergantian`
  - Wait: `18 menit`
  - Lane: `Kursi 2`
  - Samples: `A-13`, `A-14`, `A-15`
- Bengkel:
  - Service: `Ganti oli 15 menit`
  - Queue: `B-08 tinggal 2 motor`
  - Rhythm: `Bisa melonjak saat sore`
  - Wait: `2 motor`
  - Lane: `Bay cepat`
  - Samples: `B-06`, `B-07`, `B-08`
- Dokter gigi:
  - Service: `Konsultasi 30 menit`
  - Queue: `D-04 datang 09.40`
  - Rhythm: `Slot lebih tenang`
  - Wait: `09.40`
  - Lane: `Ruang 1`
  - Samples: `D-02`, `D-03`, `D-04`
- Salon:
  - Service: `Treatment 60 menit`
  - Queue: `S-11 slot sore aman`
  - Rhythm: `Layanan panjang`
  - Wait: `Sore`
  - Lane: `Stylist 3`
  - Samples: `S-09`, `S-10`, `S-11`

### Public Page Section

Isi:

- Badge: `Halaman antrian milik bisnismu`
- Title: `Setiap bisnis dapat mini website antrean sendiri.`
- Text: `Bagikan link seperti ngantri.id/barber-adi. Pelanggan bisa lihat jam buka, ambil nomor, cek lokasi, dan pantau antrean dari HP.`

Mockup konten:

- Bisnis: `Barber Adi`
- Lokasi: `Tebet, Jakarta Selatan`
- Badge status: `Buka`
- Sekarang: `A-12`
- Estimasi: `18m`
- CTA: `Booking sekarang`
- Tab `Antrean`:
  - `3 antrean lagi`
  - `Datang 18 menit`
- Tab `Info`:
  - `09.00-21.00`
  - `Dekat St. Tebet`
- Tema warna: blue, amber, emerald, rose.

### Settings Section

Isi:

- Badge: `Estimasi yang bisa diatur sendiri`
- Title: `Karena potong rambut dan coloring jelas beda waktunya.`
- Text: `Admin cukup mengatur durasi layanan. Ngantri menghitung estimasi agar pelanggan tahu kapan harus berangkat tanpa menebak-nebak.`

Mockup durasi layanan:

- `Potong rambut`: `20 min`
- `Cukur jenggot`: `10 min`
- `Coloring`: `90 min`
- `Ganti oli`: `15 min`

### WhatsApp Section

Isi:

- Badge: `Designed for WhatsApp behavior`
- Title: `Pesannya terasa familiar, bukan seperti sistem yang kaku.`
- Text: `Ngantri mengikuti kebiasaan pelanggan Indonesia: cek pesan, siap-siap, lalu datang saat waktunya sudah jelas.`

Mockup pesan:

- `Nomor kamu A-16` at `10.12`
- `3 antrean lagi, silakan bersiap.` at `10.31`
- `Giliranmu sebentar lagi. Jalan sekarang aman.` at `10.44`

### Landing Pricing Section

Section intro:

- Eyebrow: `Harga UMKM-friendly`
- Title: `Mulai rapi tanpa biaya yang bikin mikir lama.`
- Text: `Pilih paket yang sesuai dengan ramainya antrean hari ini. Naik kelas saat bisnis makin padat.`

Plans:

- Free:
  - Price: `Mulai digital`
  - Note: `Untuk coba antrean online pertama.`
  - Items: `1 halaman publik`, `Live queue dasar`, `Reservasi manual`
  - CTA: `Pilih Free`
- Pro:
  - Badge: `Paling pas`
  - Price: `Rp49rb/bulan`
  - Note: `Pas untuk UMKM jasa yang mulai ramai.`
  - Items: `Estimasi otomatis`, `Notifikasi pelanggan`, `Tema halaman bisnis`
  - CTA: `Pilih Pro`
- Business:
  - Price: `Rp149rb/bulan`
  - Note: `Untuk banyak staff, cabang, atau layanan.`
  - Items: `Multi staff`, `Analytics sederhana`, `Prioritas dukungan`
  - CTA: `Pilih Business`

### Final CTA

Isi:

- Eyebrow: `Datang pas giliranmu`
- Title: `Biar pelanggan nggak nunggu tanpa kepastian.`
- CTA: `Mulai pakai Ngantri`

### Footer

Isi brand:

- Logo + `Ngantri`
- Description: `Antrean realtime untuk UMKM jasa. Pelanggan tahu kapan berangkat, admin lebih ringan mengatur meja layanan.`
- Status: `Live queue ready`

Footer columns:

- Produk:
  - `Cerita`
  - `Fitur`
  - `Harga`
  - `Halaman Bisnis`
- Untuk UMKM:
  - `Barbershop`
  - `Bengkel`
  - `Dokter gigi`
  - `Salon`

Status card:

- `Nomor aktif`: `A-13`
- `Estimasi rata-rata`: `18 menit`
- `Data bisnis`: `Terjaga`

Bottom links:

- `Privasi`
- `Ketentuan`
- `Kontak`

Catatan review:

- Copyright tampil sebagai `Â© 2026 Ngantri. Datang pas giliranmu.`, kemungkinan encoding issue. Seharusnya `© 2026...` atau ASCII `Copyright 2026...`.

## Pricing Page

File: `frontend/app/pricing/page.tsx`

Route: `/pricing`

Isi:

- Logo link ke `/`.
- H1: `Harga yang ramah UMKM.`
- Paragraph: `Mulai dari antrean digital sederhana, lalu naik kelas saat bisnis makin ramai.`

Plans:

- Free:
  - Price: `Mulai digital`
  - Detail: `1 cabang, 10 antrean/bulan, 2 template`
  - CTA: `Pilih Paket`
- Pro:
  - Price: `Rp49rb/bulan`
  - Detail: `Multi cabang, warna custom, analytics`
  - CTA: `Pilih Paket`
- Business:
  - Price: `Rp149rb/bulan`
  - Detail: `Multi-admin, analytics lanjutan, priority support`
  - CTA: `Pilih Paket`

Catatan review:

- Konten pricing di landing page dan `/pricing` belum sepenuhnya konsisten.
- CTA belum diarahkan ke checkout/register.

## Dashboard Routes

### `/dashboard`

File: `frontend/app/dashboard/page.tsx`

Shell:

- Title: `Overview`
- Description: `Ringkasan operasional Barber Adi hari ini.`

Konten:

- Metric `Total antrean hari ini`: dari `data.analytics.totalQueuesToday`, demo `28`.
- Metric `Sedang menunggu`: demo `7`, tone orange.
- Metric `Selesai hari ini`: demo `19`, tone green.
- Metric `Top service`: demo `Potong Rambut`, tone slate.
- `StaffLaneQueueBoard` untuk staff dan queues demo.

### `/dashboard/queues`

File: `frontend/app/dashboard/queues/page.tsx`

Shell:

- Title: `Live Queue`
- Description: `Panggil, layani, skip, atau selesaikan antrean per staff.`

Konten:

- `StaffLaneQueueBoard`.

### Dashboard Placeholder Routes

File route berikut masih re-export ke `/dashboard/queues`:

- `/dashboard/bookings`
- `/dashboard/branches`
- `/dashboard/staff`
- `/dashboard/services`
- `/dashboard/customers`
- `/dashboard/theme`
- `/dashboard/qr`
- `/dashboard/analytics`
- `/dashboard/subscription`
- `/dashboard/settings`

Catatan review:

- Sidebar sudah punya route lengkap, tapi mayoritas konten belum spesifik.
- Ini bagus sebagai skeleton, tetapi perlu diprioritaskan mana yang dibuat dulu untuk MVP.

## Admin Routes

### `/admin`

File: `frontend/app/admin/page.tsx`

Shell:

- Title: `SaaS Admin`
- Description: `Pantau tenant, subscription, dan usage limit Ngantri.`

Konten:

- Metric `Businesses`: `1`
- Metric `Users`: `2`
- Metric `Free tenants`: `1`

### Admin Placeholder Routes

File route berikut masih re-export ke `/admin`:

- `/admin/businesses`
- `/admin/subscriptions`
- `/admin/templates`
- `/admin/users`

Catatan review:

- Admin area masih berupa overview metric sederhana.
- Perlu table tenant, plan, usage, status pembayaran, dan template/theme management untuk SaaS admin.

## Customer Routes

### `/customer/queues`

Isi:

- H1: `Antrean Saya`
- Text: `Pantau antrean aktif dan riwayat kunjungan.`

### `/customer/bookings`

Isi:

- H1: `Booking Saya`
- Text: `Riwayat dan booking aktif customer.`

### `/customer/profile`

Isi:

- H1: `Profil Customer`
- Text: `Kelola nama, email, dan preferensi notifikasi.`

Catatan review:

- Semua halaman customer masih placeholder card.
- Belum ada navigasi customer shell.
- Belum memakai data demo/API.

## Queue Status Page

File: `frontend/app/queue/[queueId]/status/page.tsx`

Route: `/queue/{queueId}/status`

Isi:

- Icon clock.
- Label: `Status antrean`
- Nomor antrean hardcoded: `A-16`
- ID antrean: dari param `queueId`.
- Status message: `3 antrean lagi, silakan bersiap.`

Catatan review:

- Nomor antrean dan status masih hardcoded.
- Perlu fetch detail queue berdasarkan `queueId`.
- Cocok untuk target QR/deep link customer.

## Booking Page

File: `frontend/app/[businessSlug]/[branchSlug]/booking/page.tsx`

Isi:

- Icon calendar.
- H1: `Booking Online`
- Text: `Pilih layanan, staff, tanggal, dan jam. Form ini siap dihubungkan ke endpoint booking.`
- Placeholder field:
  - `Layanan`
  - `Staff`
  - `Tanggal`
  - `Jam`
- CTA: `Konfirmasi Booking`

Catatan review:

- Belum memakai `businessSlug` dan `branchSlug`.
- Belum ada form input/select nyata.
- Belum ada validasi, slot availability, atau submit booking.

## Data Demo Frontend

File: `frontend/lib/api/queries.ts`

Hook:

- `useDemoPublicBusiness`
- `useDemoDashboard`

Demo business:

- Name: `Barber Adi`
- Slug: `barber-adi`
- Description: `Barbershop lokal dengan antrean realtime dari Ngantri.`
- Plan: `free`
- Status: `active`

Demo branches:

- `Barber Adi Sawojajar`
  - Slug: `sawojajar`
  - Address: `Sawojajar, Malang`
  - Phone: `+6281200000001`
  - Timezone: `Asia/Jakarta`
- `Barber Adi Sulfat`
  - Slug: `sulfat`
  - Address: `Sulfat, Malang`
  - Phone: `+6281200000002`
  - Timezone: `Asia/Jakarta`

Demo staff:

- `Adi`, role `Capster`, available.
- `Raka`, role `Capster`, available.
- `Bima`, role `Capster`, unavailable.

Demo services:

- `Potong Rambut`, 20 menit, Rp35.000.
- `Cukur Jenggot`, 10 menit, Rp20.000.
- `Hair Wash`, 15 menit, Rp15.000.
- `Coloring`, 90 menit, Rp150.000.

Demo queues:

- `A-01`, staff `Adi`, source `online`, status `serving`, wait 0.
- `A-04`, staff `Adi`, source `walk_in`, status `waiting`, wait 20.
- `B-02`, staff `Raka`, source `online`, status `serving`, wait 0.
- `B-03`, staff `Raka`, source `online`, status `waiting`, wait 15.

Demo analytics:

- Total queues today: `28`
- Currently waiting: `7`
- Currently serving: `2`
- Completed today: `19`
- No show today: `1`
- Average wait: `18`
- Busiest hour: `16.00`
- Top service: `Potong Rambut`

## Domain Types Frontend

File: `frontend/lib/contracts.ts`

Tipe utama:

- `User`
- `Business`
- `Branch`
- `BranchStaff`
- `Service`
- `QueueItem`
- `Booking`
- `AnalyticsOverview`
- `ApiEnvelope`
- `ApiError`

Enum string penting:

- Global role: `customer`, `super_admin`
- Business role: `owner`, `admin`
- Subscription plan: `free`, `pro`, `business`
- Subscription status: `active`, `past_due`, `cancelled`
- Queue source: `walk_in`, `online`
- Queue status: `waiting`, `called`, `serving`, `completed`, `skipped`, `cancelled`, `no_show`
- Booking status: `pending`, `confirmed`, `checked_in`, `serving`, `completed`, `cancelled`, `no_show`
- Notification event: `queue_created`, `queue_almost_ready`, `queue_called`, `booking_confirmed`, `booking_cancelled`

## Komponen UI Dasar

### Button

File: `frontend/components/ui/button.tsx`

Fungsi:

- Wrapper tombol berbasis `class-variance-authority`.
- Mendukung `asChild` via Radix Slot.
- Variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`.
- Sizes: `default`, `sm`, `lg`, `icon`.

### Card

File: `frontend/components/ui/card.tsx`

Fungsi:

- `Card`: wrapper div dengan border, background card, foreground card, shadow.
- `CardContent`: wrapper content dengan default padding.

### Badge

File: `frontend/components/ui/badge.tsx`

Fungsi:

- Badge kecil berbasis CVA.
- Variants: `default`, `secondary`, `destructive`, `outline`.

### Tabs

File: `frontend/components/ui/tabs.tsx`

Fungsi:

- Wrapper Radix Tabs.
- Export `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`.
- Dipakai di landing page mockup public page.

## Hal yang Paling Perlu Direview

1. Konsistensi copy: `Antrian` vs `Antrean`, `WhatsApp-style` vs bahasa Indonesia, `Continue with Google`, dan placeholder forgot password.
2. Konsistensi pricing: landing page dan `/pricing` punya detail paket yang berbeda.
3. Pemisahan mode publik dan admin pada `StaffLaneQueueBoard`, karena halaman publik tidak seharusnya menampilkan tombol `Panggil Berikutnya`.
4. Mobile navigation dashboard belum ada.
5. Banyak route masih placeholder atau re-export ke halaman lain.
6. CTA belum punya tujuan/action nyata.
7. Data hardcoded perlu diganti API, terutama status queue, branch aktif, current serving, dan booking flow.
8. Encoding footer landing page perlu dibersihkan dari `Â©`.

