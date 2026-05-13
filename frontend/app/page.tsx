"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BarChart3,
  BellRing,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  LayoutDashboard,
  Menu,
  MessageCircle,
  QrCode,
  Radio,
  Scissors,
  Sparkles,
  Stethoscope,
  Store,
  Ticket,
  Users,
  Wrench,
} from "lucide-react";

import { NgantriLogo } from "@/components/ngantri/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const pains = [
  {
    icon: MessageCircle,
    title: "Chat posisi antrean tidak berhenti",
    signal: "12 chat/jam",
    example: "Contoh: pelanggan tanya, \"Mas, masih lama?\" padahal admin sedang melayani.",
  },
  {
    icon: LayoutDashboard,
    title: "Admin pindah-pindah catatan saat jam ramai",
    signal: "3 sumber data",
    example: "Contoh: nomor walk-in ada di buku, booking ada di WhatsApp, staff tanya urutan berikutnya.",
  },
  {
    icon: Clock3,
    title: "Pelanggan datang terlalu cepat atau terlambat",
    signal: "18 menit meleset",
    example: "Contoh: kursi penuh, pelanggan menunggu lama, lalu pergi sebelum gilirannya dipanggil.",
  },
];

const steps = [
  {
    icon: QrCode,
    title: "Buat halaman bisnis",
    actor: "Owner",
    action: "Bagikan link atau QR cabang",
    detail: "Profil layanan, staff, jam buka, dan aturan antrean tersimpan di satu halaman publik.",
  },
  {
    icon: Ticket,
    title: "Pelanggan ambil nomor",
    actor: "Pelanggan",
    action: "Pilih layanan dari HP",
    detail: "Mereka melihat nomor aktif, sisa antrean, dan estimasi sebelum memutuskan datang.",
  },
  {
    icon: LayoutDashboard,
    title: "Admin panggil giliran",
    actor: "Staff",
    action: "Panggil, skip, atau selesai",
    detail: "Dashboard menjaga urutan walk-in dan booking tetap jelas untuk tiap meja layanan.",
  },
  {
    icon: BellRing,
    title: "Pelanggan datang tepat waktu",
    actor: "Sistem",
    action: "Kirim update saat nomor dekat",
    detail: "Pelanggan punya alasan yang jelas kapan harus berangkat, bukan menebak dari chat.",
  },
];

const customerFeatures = [
  ["Antrean realtime", "Lihat nomor aktif dan sisa antrean."],
  ["Estimasi tunggu", "Tahu kapan harus berangkat."],
  ["Booking online", "Pilih layanan, staff, dan jam."],
];

const adminFeatures = [
  ["Live queue board", "Pantau staff dan nomor yang sedang dilayani."],
  ["Atur durasi layanan", "Estimasi mengikuti ritme layanan."],
  ["Ringkasan operasional", "Lihat antrean, selesai, dan jam ramai."],
];

const useCases = [
  {
    icon: Scissors,
    title: "Barbershop",
    text: "Pisahkan antrean per kursi dan bantu pelanggan datang saat nomor mendekat.",
  },
  {
    icon: Sparkles,
    title: "Salon",
    text: "Kelola layanan pendek dan panjang tanpa membuat pelanggan menunggu tanpa kabar.",
  },
  {
    icon: Wrench,
    title: "Bengkel",
    text: "Rapikan antrean bay cepat, service ringan, dan booking pelanggan tetap.",
  },
  {
    icon: Stethoscope,
    title: "Klinik kecil",
    text: "Beri estimasi kunjungan yang lebih jelas untuk pasien dan resepsionis.",
  },
];

const plans = [
  {
    name: "Free",
    price: "Mulai digital",
    note: "Untuk validasi antrean online pertama.",
    items: ["1 halaman publik", "Live queue dasar", "Reservasi manual"],
  },
  {
    name: "Pro",
    price: "Rp49rb/bulan",
    note: "Untuk UMKM jasa yang mulai ramai.",
    items: ["Estimasi otomatis", "Notifikasi pelanggan", "Tema halaman bisnis"],
    featured: true,
  },
  {
    name: "Business",
    price: "Rp149rb/bulan",
    note: "Untuk multi staff, cabang, atau layanan.",
    items: ["Multi staff", "Analytics sederhana", "Prioritas dukungan"],
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground [font-family:'Plus_Jakarta_Sans',Inter,system-ui,sans-serif]">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <FlowSection />
      <ProductSection />
      <UseCaseSection />
      <PricingSection />
      <FinalCta />
      <Footer />
    </main>
  );
}

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link className="flex items-center gap-3" href="/">
          <NgantriLogo iconClassName="size-10" />
          <span className="text-base font-black tracking-normal">Ngantri</span>
        </Link>
        <div className="hidden items-center gap-7 text-sm font-semibold text-muted-foreground md:flex">
          <a className="transition hover:text-primary" href="#produk">
            Produk
          </a>
          <a className="transition hover:text-primary" href="#alur">
            Alur
          </a>
          <a className="transition hover:text-primary" href="#harga">
            Harga
          </a>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" className="hidden h-10 px-4 font-bold md:inline-flex">
            <Link href="/login">Masuk</Link>
          </Button>
          <Button asChild className="h-10 rounded-lg px-4 font-bold">
            <Link href="/register">Coba Gratis</Link>
          </Button>
          <Button variant="outline" size="icon" className="size-10 rounded-lg md:hidden">
            <Menu className="size-4" />
          </Button>
        </div>
      </nav>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-slate-950 text-white">
      <HeroScene />
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-[760px] py-10 lg:max-w-[740px] xl:max-w-[820px]">
          <Badge className="rounded-lg border-white/10 bg-white/10 px-3 py-1.5 text-white hover:bg-white/10">
            <Radio className="mr-2 size-4 text-emerald-300" />
            Antrean realtime untuk UMKM jasa
          </Badge>
          <h1 className="mt-6 max-w-[760px] text-4xl font-black leading-[1.03] tracking-normal sm:text-5xl lg:text-6xl xl:text-7xl">
            Kelola antrean online tanpa bikin pelanggan menunggu tanpa kepastian.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            Ngantri membantu barbershop, salon, bengkel, dan klinik kecil
            menampilkan antrean realtime, estimasi tunggu, dan booking online
            dari satu link publik.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild className="h-12 rounded-lg bg-blue-500 px-6 text-base font-black hover:bg-blue-400">
              <Link href="/register">
                Coba Gratis
                <ArrowRight className="ml-2 size-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 rounded-lg border-white/20 bg-white/10 px-6 text-base font-black text-white hover:bg-white hover:text-slate-950"
            >
              <Link href="/barber-adi">Lihat Demo</Link>
            </Button>
          </div>
          <div className="mt-10 grid max-w-2xl gap-3 border-t border-white/10 pt-6 text-sm font-semibold text-slate-300 sm:grid-cols-3">
            <ProofPoint value="18 menit" label="estimasi tunggu" />
            <ProofPoint value="1 link" label="untuk antrean dan booking" />
            <ProofPoint value="Tanpa app" label="untuk pelanggan" />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroScene() {
  return (
    <div aria-hidden className="absolute inset-0">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.96)_0%,rgba(15,23,42,0.82)_42%,rgba(15,23,42,0.35)_100%)]" />
      <div className="absolute right-[-320px] top-16 hidden w-[700px] rotate-[-5deg] lg:block xl:right-[-260px] xl:w-[760px] 2xl:right-[-220px] 2xl:w-[820px]">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="rounded-lg border border-white/10 bg-white/10 p-4 shadow-2xl shadow-black/30 backdrop-blur"
        >
          <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-lg bg-card p-5 text-card-foreground">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase text-slate-400">Barber Adi</p>
                  <h2 className="mt-1 text-2xl font-black">Live Queue</h2>
                </div>
                <span className="inline-flex items-center rounded-lg bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                  Live
                </span>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <DashboardMetric label="Menunggu" value="7" />
                <DashboardMetric label="Dilayani" value="2" />
                <DashboardMetric label="Selesai" value="19" />
              </div>
              <div className="mt-5 grid gap-3">
                <QueueRow name="Adi" role="Capster" serving="A-12" next="A-16" active />
                <QueueRow name="Raka" role="Capster" serving="B-02" next="B-03" />
                <QueueRow name="Bima" role="Capster" serving="-" next="Istirahat" muted />
              </div>
            </div>
            <div className="rounded-lg bg-muted p-4 text-foreground">
              <div className="rounded-lg bg-blue-600 p-4 text-white">
                <p className="text-xs font-bold text-blue-100">ngantri.id/barber-adi</p>
                <h3 className="mt-2 text-xl font-black">Nomor kamu</h3>
                <p className="mt-3 text-5xl font-black">A-16</p>
                <p className="mt-2 text-sm font-semibold text-blue-100">
                  Datang sekitar 18 menit lagi
                </p>
              </div>
              <div className="mt-3 space-y-2">
                {["A-13", "A-14", "A-15"].map((code, index) => (
                  <div key={code} className="flex items-center justify-between rounded-lg bg-card p-3">
                    <span className="font-black">{code}</span>
                    <span className="text-xs font-bold text-muted-foreground">
                      {index + 1} antrean lagi
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ProblemSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <div>
          <SectionLabel>Masalah yang familiar</SectionLabel>
          <h2 className="mt-4 max-w-2xl text-3xl font-black leading-tight tracking-normal sm:text-4xl">
            Masalah antrean biasanya bukan jumlah pelanggan, tapi ketidakpastian.
          </h2>
        </div>
        <p className="max-w-2xl text-base leading-8 text-muted-foreground">
          Ngantri membuat posisi antrean, estimasi tunggu, dan booking lebih
          jelas untuk pelanggan maupun staff. Hasilnya: chat lebih sedikit,
          keputusan lebih cepat, dan operasional terasa lebih rapi.
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px]">
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1">
          {pains.map((pain, index) => (
            <motion.div
              key={pain.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.08 }}
              className="rounded-lg border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-lg bg-muted text-primary">
                    <pain.icon className="size-5" />
                  </span>
                  <span className="text-sm font-black text-muted-foreground">0{index + 1}</span>
                </div>
                <span className="rounded-lg bg-primary/10 px-3 py-1 text-xs font-black text-primary">
                  {pain.signal}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-black leading-7">{pain.title}</h3>
              <p className="mt-3 text-sm font-semibold leading-7 text-muted-foreground">{pain.example}</p>
            </motion.div>
          ))}
        </div>

        <div className="rounded-lg border border-border bg-slate-950 p-5 text-white shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-300">
                Situasi jam ramai
              </p>
              <h3 className="mt-2 text-xl font-black">Sabtu, 16.30</h3>
            </div>
            <span className="rounded-lg bg-white/10 px-3 py-1 text-xs font-black text-white">
              Walk-in + booking
            </span>
          </div>
          <div className="mt-5 grid gap-3">
            <ProblemSignal label="Pelanggan di tempat" value="9 orang" />
            <ProblemSignal label="Booking masuk" value="4 jadwal" />
            <ProblemSignal label="Chat tanya giliran" value="Belum berhenti" />
          </div>
          <div className="mt-5 rounded-lg bg-white/10 p-4">
            <p className="text-sm font-black">Yang bikin macet bukan ramainya.</p>
            <p className="mt-2 text-sm font-semibold leading-7 text-slate-300">
              Yang bikin staff kewalahan adalah semua orang butuh kepastian di
              waktu yang sama: nomor berapa, siapa berikutnya, dan kapan harus datang.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function FlowSection() {
  return (
    <section id="alur" className="border-y border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
          <div className="max-w-2xl">
            <SectionLabel>Satu flow sederhana</SectionLabel>
            <h2 className="mt-4 text-3xl font-black leading-tight tracking-normal sm:text-4xl">
              Dari link publik sampai pelanggan datang pas giliran.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-muted-foreground">
            Alurnya dibuat seperti handoff harian: owner menyiapkan link, pelanggan
            mengambil nomor, staff menggerakkan antrean, lalu sistem memberi kabar.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px]">
          <div className="grid gap-4 md:grid-cols-2">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: index * 0.08 }}
                className="relative rounded-lg border border-border bg-background p-5 shadow-sm"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="grid size-11 place-items-center rounded-lg bg-primary/10 text-primary">
                      <step.icon className="size-5" />
                    </span>
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">
                        Langkah {index + 1}
                      </p>
                      <p className="mt-1 text-sm font-black text-primary">{step.actor}</p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <ChevronRight className="hidden size-5 text-muted-foreground md:block" />
                  )}
                </div>
                <h3 className="mt-5 text-xl font-black">{step.title}</h3>
                <p className="mt-3 text-sm font-black leading-6 text-foreground">{step.action}</p>
                <p className="mt-3 text-sm font-semibold leading-7 text-muted-foreground">{step.detail}</p>
              </motion.div>
            ))}
          </div>

          <div className="rounded-lg border border-border bg-background p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">
                  Contoh hari ini
                </p>
                <h3 className="mt-2 text-xl font-black">Barber Adi Sulfat</h3>
              </div>
              <span className="rounded-lg bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                Live
              </span>
            </div>
            <div className="mt-5 grid gap-3">
              <FlowStatusRow icon={QrCode} label="QR di meja kasir" value="ngantri.id/barber-adi/sulfat" />
              <FlowStatusRow icon={Ticket} label="Nomor baru" value="A-16, Potong Rambut" />
              <FlowStatusRow icon={Users} label="Sedang dilayani" value="A-12 oleh Adi" />
              <FlowStatusRow icon={Clock3} label="Estimasi pelanggan" value="Datang sekitar 18 menit lagi" />
              <FlowStatusRow icon={MessageCircle} label="Update otomatis" value="Nomor kamu sudah dekat" />
            </div>
            <div className="mt-5 rounded-lg bg-primary p-4 text-primary-foreground">
              <p className="text-sm font-black">Dampaknya terasa di meja depan</p>
              <p className="mt-2 text-sm font-semibold leading-7 text-primary-foreground/80">
                Pelanggan tidak perlu menebak, staff tidak perlu menjawab chat
                berulang, dan owner bisa melihat ritme layanan dari dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductSection() {
  return (
    <section id="produk" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
        <div className="lg:sticky lg:top-24">
          <SectionLabel>Produk inti</SectionLabel>
          <h2 className="mt-4 text-3xl font-black leading-tight tracking-normal sm:text-4xl">
            Satu sistem untuk halaman publik dan meja admin.
          </h2>
          <p className="mt-5 text-base leading-8 text-muted-foreground">
            Landing page tidak perlu menjelaskan semua modul. Yang penting user
            langsung melihat dua sisi produk: pelanggan bisa ambil nomor, admin
            bisa mengatur antrean.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Button asChild className="h-11 rounded-lg font-black">
              <Link href="/register">Mulai gratis</Link>
            </Button>
            <Button asChild variant="outline" className="h-11 rounded-lg font-black">
              <Link href="/barber-adi">Buka demo publik</Link>
            </Button>
          </div>
        </div>
        <div className="grid gap-4">
          <PreviewPanel title="Untuk pelanggan" icon={Store}>
            <PublicPreview />
            <FeatureList items={customerFeatures} />
          </PreviewPanel>
          <PreviewPanel title="Untuk admin" icon={LayoutDashboard}>
            <AdminPreview />
            <FeatureList items={adminFeatures} />
          </PreviewPanel>
        </div>
      </div>
    </section>
  );
}

function UseCaseSection() {
  return (
    <section className="border-y border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <SectionLabel>Cocok untuk</SectionLabel>
            <h2 className="mt-4 text-3xl font-black leading-tight tracking-normal sm:text-4xl">
              Bisnis jasa yang punya giliran layanan.
            </h2>
          </div>
          <p className="max-w-md text-sm font-semibold leading-7 text-muted-foreground">
            Dari kursi barber sampai ruang klinik, Ngantri fokus ke bisnis yang
            butuh urutan, estimasi, dan booking yang jelas.
          </p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {useCases.map((item) => (
            <UseCaseCard key={item.title} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section id="harga" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <SectionLabel>Harga</SectionLabel>
        <h2 className="mt-4 text-3xl font-black leading-tight tracking-normal sm:text-4xl">
          Mulai rapi tanpa biaya yang bikin mikir lama.
        </h2>
        <p className="mt-4 text-base leading-8 text-muted-foreground">
          Paket dibuat bertahap: coba dulu, aktifkan fitur saat antrean mulai
          ramai, lalu scale ketika cabang dan staff bertambah.
        </p>
      </div>
      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-lg border bg-card p-6 shadow-sm ${
              plan.featured ? "border-primary/40 ring-2 ring-primary/15" : "border-border"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-black">{plan.name}</h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-muted-foreground">{plan.note}</p>
              </div>
              {plan.featured && (
                <span className="rounded-lg bg-primary/10 px-3 py-1 text-xs font-black text-primary">
                  Paling pas
                </span>
              )}
            </div>
            <p className="mt-6 text-3xl font-black tracking-normal">{plan.price}</p>
            <div className="mt-6 grid gap-3">
              {plan.items.map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm font-bold text-foreground">
                  <Check className="size-4 text-emerald-600" />
                  {item}
                </div>
              ))}
            </div>
            <Button
              asChild
              className={`mt-7 h-11 w-full rounded-lg font-black ${
                plan.featured ? "" : "bg-foreground text-background hover:bg-foreground/90"
              }`}
            >
              <Link href="/register">Pilih {plan.name}</Link>
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-300">
            Datang pas giliranmu
          </p>
          <h2 className="mt-4 max-w-3xl text-3xl font-black leading-tight tracking-normal sm:text-4xl">
            Buat antrean bisnismu lebih jelas hari ini.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
            Mulai dari satu halaman publik, lalu sambungkan booking, estimasi,
            staff, dan analytics saat bisnismu siap.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
          <Button asChild className="h-12 rounded-lg bg-blue-500 px-6 font-black hover:bg-blue-400">
            <Link href="/register">
              Coba Gratis
              <ArrowRight className="ml-2 size-5" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-12 rounded-lg border-white/20 bg-white/10 px-6 font-black text-white hover:bg-white hover:text-slate-950"
          >
            <Link href="/pricing">Lihat Harga</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <Link className="inline-flex items-center gap-3 text-white" href="/">
              <NgantriLogo iconClassName="size-10" />
              <span className="font-black">Ngantri</span>
            </Link>
            <p className="mt-4 max-w-md text-sm font-semibold leading-7">
              Antrean realtime untuk UMKM jasa. Pelanggan tahu kapan berangkat,
              admin lebih ringan mengatur meja layanan.
            </p>
          </div>
          <FooterColumn
            title="Produk"
            links={[
              ["Produk", "#produk"],
              ["Alur", "#alur"],
              ["Harga", "#harga"],
              ["Demo", "/barber-adi"],
            ]}
          />
          <FooterColumn
            title="Akun"
            links={[
              ["Masuk", "/login"],
              ["Daftar", "/register"],
              ["Pricing", "/pricing"],
            ]}
          />
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t border-slate-800 pt-5 text-sm font-semibold sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright 2026 Ngantri. Datang pas giliranmu.</p>
          <div className="flex gap-4">
            <a className="transition hover:text-white" href="#">
              Privasi
            </a>
            <a className="transition hover:text-white" href="#">
              Ketentuan
            </a>
            <a className="transition hover:text-white" href="#">
              Kontak
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-primary">
      {children}
    </span>
  );
}

function FlowStatusRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg bg-muted p-3">
      <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-background text-primary">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-bold text-muted-foreground">{label}</p>
        <p className="mt-1 break-words text-sm font-black leading-6">{value}</p>
      </div>
    </div>
  );
}

function ProblemSignal({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg bg-white/10 p-3">
      <p className="text-sm font-semibold text-slate-300">{label}</p>
      <p className="text-sm font-black text-white">{value}</p>
    </div>
  );
}

function ProofPoint({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-xl font-black text-white">{value}</p>
      <p className="mt-1 text-sm text-slate-400">{label}</p>
    </div>
  );
}

function DashboardMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-muted p-3">
      <p className="text-xs font-bold text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-black">{value}</p>
    </div>
  );
}

function QueueRow({
  name,
  role,
  serving,
  next,
  active,
  muted,
}: {
  name: string;
  role: string;
  serving: string;
  next: string;
  active?: boolean;
  muted?: boolean;
}) {
  return (
    <div className={`rounded-lg border p-4 ${muted ? "border-border bg-muted" : "border-border bg-card"}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-black">{name}</p>
          <p className="text-xs font-bold text-muted-foreground">{role}</p>
        </div>
        <span
          className={`rounded-lg px-2.5 py-1 text-xs font-black ${
            active ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" : "bg-muted text-muted-foreground"
          }`}
        >
          {active ? "Aktif" : muted ? "Istirahat" : "Aktif"}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs font-bold text-muted-foreground">Dilayani</p>
          <p className="mt-1 text-xl font-black">{serving}</p>
        </div>
        <div>
          <p className="text-xs font-bold text-muted-foreground">Berikutnya</p>
          <p className="mt-1 text-xl font-black">{next}</p>
        </div>
      </div>
    </div>
  );
}

function PreviewPanel({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-5" />
        </span>
        <h3 className="text-xl font-black">{title}</h3>
      </div>
      <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr] lg:items-start">{children}</div>
    </div>
  );
}

function PublicPreview() {
  return (
    <div className="rounded-lg border border-border bg-foreground p-3">
      <div className="rounded-lg bg-card p-4">
        <div className="rounded-lg bg-blue-600 p-4 text-white">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-blue-100">Barber Adi Sawojajar</p>
              <h4 className="mt-1 text-2xl font-black">A-16</h4>
            </div>
            <span className="rounded-lg bg-white/15 px-2.5 py-1 text-xs font-black">Live</span>
          </div>
          <p className="mt-3 text-sm font-semibold text-blue-100">Datang sekitar 18 menit lagi</p>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <MiniStat icon={Ticket} label="Sekarang" value="A-12" />
          <MiniStat icon={Clock3} label="Sisa" value="3 lagi" />
        </div>
        <Button className="mt-3 h-10 w-full rounded-lg font-black">
          Ambil Nomor
        </Button>
      </div>
    </div>
  );
}

function AdminPreview() {
  return (
    <div className="rounded-lg border border-border bg-muted p-4">
      <div className="grid grid-cols-3 gap-3">
        <MiniStat icon={Users} label="Menunggu" value="7" />
        <MiniStat icon={Clock3} label="Rata-rata" value="18m" />
        <MiniStat icon={BarChart3} label="Selesai" value="19" />
      </div>
      <div className="mt-3 space-y-2">
        <AdminLine icon={Scissors} title="Adi" meta="A-12 dilayani" />
        <AdminLine icon={CalendarDays} title="Booking 14.30" meta="Raka - Hair wash" />
        <AdminLine icon={BellRing} title="Notifikasi" meta="A-16 diminta bersiap" />
      </div>
    </div>
  );
}

function FeatureList({ items }: { items: string[][] }) {
  return (
    <div className="grid gap-3">
      {items.map(([title, text]) => (
        <div key={title} className="rounded-lg border border-border bg-muted p-4">
          <div className="flex items-start gap-3">
            <Check className="mt-1 size-4 shrink-0 text-emerald-600" />
            <div>
              <p className="font-black">{title}</p>
              <p className="mt-1 text-sm font-semibold leading-6 text-muted-foreground">{text}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function MiniStat({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <Icon className="size-4 text-primary" />
      <p className="mt-2 text-xs font-bold text-muted-foreground">{label}</p>
      <p className="mt-1 font-black text-foreground">{value}</p>
    </div>
  );
}

function AdminLine({ icon: Icon, title, meta }: { icon: LucideIcon; title: string; meta: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-card p-3">
      <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-4" />
      </span>
      <div>
        <p className="text-sm font-black">{title}</p>
        <p className="text-xs font-bold text-muted-foreground">{meta}</p>
      </div>
    </div>
  );
}

function UseCaseCard({ item }: { item: (typeof useCases)[number] }) {
  const Icon = item.icon;

  return (
    <div className="rounded-lg border border-border bg-background p-5">
      <span className="grid size-11 place-items-center rounded-lg bg-card text-primary shadow-sm">
        <Icon className="size-5" />
      </span>
      <h3 className="mt-5 text-lg font-black">{item.title}</h3>
      <p className="mt-3 text-sm font-semibold leading-7 text-muted-foreground">{item.text}</p>
    </div>
  );
}

function FooterColumn({ title, links }: { title: string; links: string[][] }) {
  return (
    <div>
      <p className="font-black text-white">{title}</p>
      <div className="mt-4 grid gap-3">
        {links.map(([label, href]) => (
          <Link key={label} className="text-sm font-semibold transition hover:text-white" href={href}>
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
