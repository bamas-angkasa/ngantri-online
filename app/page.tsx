"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  AlertTriangle,
  BarChart3,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  LockKeyhole,
  MapPin,
  MessageCircle,
  Radio,
  Scissors,
  Settings2,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Store,
  Ticket,
  TimerReset,
  Users,
  Zap,
  Wrench,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NgantriLogo } from "@/components/ngantri/logo";

const modules = [
  {
    icon: BriefcaseBusiness,
    title: "Live Queue",
    text: "Nomor aktif, sisa antrean, dan status layanan tampil realtime.",
    tag: "Realtime",
    tone: "blue",
    fragment: <QueueMini now="A-12" next="A-13" />,
  },
  {
    icon: Clock3,
    title: "Estimasi Waktu",
    text: "Durasi tiap layanan menyesuaikan jam operasional dan kondisi antrean.",
    tag: "Dinamis",
    tone: "orange",
    fragment: <TimeMini />,
  },
  {
    icon: CalendarDays,
    title: "Reservasi Online",
    text: "Pelanggan ambil nomor dari rumah tanpa install aplikasi.",
    tag: "Praktis",
    tone: "green",
    fragment: <BookingMini />,
  },
  {
    icon: Store,
    title: "Halaman Bisnis",
    text: "Mini website antrean dengan warna dan info bisnis sendiri.",
    tag: "Profesional",
    tone: "purple",
    fragment: <PageMini />,
  },
  {
    icon: MessageCircle,
    title: "Notifikasi WhatsApp-style",
    text: "Pesan otomatis saat nomor makin dekat dengan giliran.",
    tag: "Familiar",
    tone: "green",
    fragment: <ChatMini />,
  },
  {
    icon: Users,
    title: "Multi Staff",
    text: "Pisahkan antrean per kursi, mekanik, dokter, atau counter.",
    tag: "Fleksibel",
    tone: "orange",
    fragment: <StaffMini />,
  },
  {
    icon: BarChart3,
    title: "Analytics Sederhana",
    text: "Lihat jam ramai, rata-rata tunggu, dan layanan favorit.",
    tag: "Berguna",
    tone: "purple",
    wide: true,
    fragment: <ChartMini />,
  },
];

const businesses = [
  {
    icon: Scissors,
    name: "Barbershop",
    service: "Potong 20 menit",
    queue: "A-16 siap 18 menit lagi",
    rhythm: "Cepat, kursi bergantian",
    wait: "18 menit",
    lane: "Kursi 2",
    tone: "blue",
    samples: ["A-13", "A-14", "A-15"],
  },
  {
    icon: Wrench,
    name: "Bengkel",
    service: "Ganti oli 15 menit",
    queue: "B-08 tinggal 2 motor",
    rhythm: "Bisa melonjak saat sore",
    wait: "2 motor",
    lane: "Bay cepat",
    tone: "orange",
    samples: ["B-06", "B-07", "B-08"],
  },
  {
    icon: Stethoscope,
    name: "Dokter gigi",
    service: "Konsultasi 30 menit",
    queue: "D-04 datang 09.40",
    rhythm: "Slot lebih tenang",
    wait: "09.40",
    lane: "Ruang 1",
    tone: "green",
    samples: ["D-02", "D-03", "D-04"],
  },
  {
    icon: Sparkles,
    name: "Salon",
    service: "Treatment 60 menit",
    queue: "S-11 slot sore aman",
    rhythm: "Layanan panjang",
    wait: "Sore",
    lane: "Stylist 3",
    tone: "rose",
    samples: ["S-09", "S-10", "S-11"],
  },
];

const pricing = [
  {
    name: "Free",
    price: "Mulai digital",
    note: "Untuk coba antrean online pertama.",
    items: ["1 halaman publik", "Live queue dasar", "Reservasi manual"],
  },
  {
    name: "Pro",
    price: "Rp49rb/bulan",
    note: "Pas untuk UMKM jasa yang mulai ramai.",
    items: ["Estimasi otomatis", "Notifikasi pelanggan", "Tema halaman bisnis"],
    featured: true,
  },
  {
    name: "Business",
    price: "Rp149rb/bulan",
    note: "Untuk banyak staff, cabang, atau layanan.",
    items: ["Multi staff", "Analytics sederhana", "Prioritas dukungan"],
  },
];

const serviceDurations = [
  ["Potong rambut", "20 min", "w-1/4 bg-blue-600"],
  ["Cukur jenggot", "10 min", "w-[14%] bg-amber-500"],
  ["Coloring", "90 min", "w-11/12 bg-emerald-500"],
  ["Ganti oli", "15 min", "w-1/5 bg-slate-900"],
];

const moduleTones = {
  blue: {
    icon: "bg-blue-600 text-white",
    chip: "bg-emerald-50 text-emerald-700",
    preview: "border-blue-100 bg-blue-50/70 text-blue-700",
  },
  orange: {
    icon: "bg-orange-500 text-white",
    chip: "bg-orange-50 text-orange-700",
    preview: "border-orange-100 bg-orange-50/70 text-orange-700",
  },
  green: {
    icon: "bg-emerald-500 text-white",
    chip: "bg-emerald-50 text-emerald-700",
    preview: "border-emerald-100 bg-emerald-50/70 text-emerald-700",
  },
  purple: {
    icon: "bg-violet-500 text-white",
    chip: "bg-violet-50 text-violet-700",
    preview: "border-violet-100 bg-violet-50/70 text-violet-700",
  },
} as const;

const businessTones = {
  blue: {
    icon: "bg-blue-600 text-white",
    chip: "bg-blue-50 text-blue-700",
    text: "text-blue-700",
    active: "bg-blue-600 text-white",
  },
  orange: {
    icon: "bg-orange-500 text-white",
    chip: "bg-orange-50 text-orange-700",
    text: "text-orange-700",
    active: "bg-orange-500 text-white",
  },
  green: {
    icon: "bg-emerald-500 text-white",
    chip: "bg-emerald-50 text-emerald-700",
    text: "text-emerald-700",
    active: "bg-emerald-500 text-white",
  },
  rose: {
    icon: "bg-rose-500 text-white",
    chip: "bg-rose-50 text-rose-700",
    text: "text-rose-700",
    active: "bg-rose-500 text-white",
  },
} as const;

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#F9FAFB] text-[#111827] [font-family:'Plus_Jakarta_Sans',Inter,system-ui,sans-serif]">
      <BackgroundAtmosphere />
      <Navbar />
      <HeroSection />
      <BeforeAfterSection />
      <ModulesSection />
      <BusinessSection />
      <PublicPageSection />
      <SettingsSection />
      <WhatsAppSection />
      <PricingSection />
      <FinalCta />
    </main>
  );
}

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/70 bg-white/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a className="flex items-center gap-3" href="#">
          <NgantriLogo iconClassName="size-14" />
        </a>
        <div className="hidden items-center gap-6 text-sm font-semibold text-slate-600 md:flex">
          <a className="transition hover:text-blue-600" href="#cerita">
            Cerita
          </a>
          <a className="transition hover:text-blue-600" href="#fitur">
            Fitur
          </a>
          <a className="transition hover:text-blue-600" href="#harga">
            Harga
          </a>
        </div>
        <Button className="h-11 rounded-2xl bg-blue-600 px-5 text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700">
          Coba Gratis
        </Button>
      </nav>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-10 sm:px-6 md:pt-16 lg:grid-cols-[0.92fr_1.08fr] lg:px-8 lg:pb-24">
      <div className="relative z-10">
        <Badge className="mb-5 rounded-full border-emerald-200 bg-emerald-50 px-4 py-2 text-emerald-700 hover:bg-emerald-50">
          <span className="mr-2 size-2 rounded-full bg-emerald-500 shadow-[0_0_0_6px_rgba(16,185,129,0.14)]" />
          Live antrean untuk UMKM jasa
        </Badge>
        <h1 className="max-w-3xl text-4xl font-black leading-[1.04] tracking-normal text-slate-950 sm:text-5xl lg:text-6xl">
          Antrian yang bikin pelanggan datang pas waktunya.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
          Ngantri bantu UMKM jasa menampilkan antrean realtime, estimasi waktu,
          dan reservasi online tanpa aplikasi ribet.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button className="h-14 rounded-[20px] bg-blue-600 px-7 text-base font-black shadow-xl shadow-blue-600/20 hover:bg-blue-700">
            Coba Ngantri Gratis
            <ArrowRight className="ml-2 size-5" />
          </Button>
          <Button
            variant="outline"
            className="h-14 rounded-[20px] border-slate-200 bg-white px-7 text-base font-black hover:bg-slate-50"
          >
            Lihat Demo Antrian
          </Button>
        </div>
        <QueueJourney />
      </div>

      <div className="relative min-h-[640px] sm:min-h-[690px] lg:min-h-[720px]">
        <FloatingTicket className="left-0 top-10 rotate-[-8deg]" code="A-14" label="Masuk 2 lagi" />
        <FloatingTicket className="right-0 top-16 rotate-[7deg]" code="B-03" label="Reservasi 14.30" orange />
        <FloatingTicket className="bottom-28 left-1 rotate-[5deg]" code="C-21" label="Sudah check-in" green />
        <LiveQueueBoard />
        <PhoneMockup />
      </div>
    </section>
  );
}

function LiveQueueBoard() {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      className="absolute left-1/2 top-0 z-20 w-[min(92vw,520px)] -translate-x-1/2 rounded-[28px] border border-white bg-white/95 p-5 shadow-2xl shadow-slate-900/10 sm:p-6"
    >
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-slate-500">Barber Adi, Tebet</p>
          <h2 className="text-2xl font-black tracking-normal">Papan antrean</h2>
        </div>
        <Badge className="rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-700 hover:bg-emerald-50">
          <LiveDot />
          Live
        </Badge>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-[24px] bg-slate-950 p-5 text-white">
          <p className="text-sm font-bold text-slate-300">Sekarang dilayani</p>
          <div className="mt-4 flex items-end justify-between">
            <motion.span
              key="serving"
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="text-5xl font-black"
            >
              A-12
            </motion.span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold">
              Kursi 2
            </span>
          </div>
        </div>
        <div className="rounded-[24px] border border-blue-100 bg-blue-50 p-5">
          <p className="text-sm font-bold text-blue-700">Nomor kamu</p>
          <div className="mt-4 flex items-end justify-between">
            <span className="text-5xl font-black text-blue-700">A-16</span>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-blue-700 shadow-sm">
              3 lagi
            </span>
          </div>
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Metric icon={Clock3} label="Estimasi datang" value="18 menit" />
        <Metric icon={TimerReset} label="Sisa antrean" value="3 antrean lagi" />
      </div>
      <div className="mt-5">
        <div className="mb-2 flex justify-between text-xs font-bold text-slate-500">
          <span>A-12</span>
          <span>A-16</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-100">
          <motion.div
            animate={{ width: ["42%", "68%", "58%"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="h-full rounded-full bg-gradient-to-r from-blue-600 via-emerald-500 to-amber-400"
          />
        </div>
      </div>
    </motion.div>
  );
}

function PhoneMockup() {
  return (
    <motion.div
      animate={{ y: [0, 10, 0], rotate: [0, -1.5, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      className="absolute bottom-0 right-1/2 z-30 w-[280px] translate-x-1/2 rounded-[42px] border-[10px] border-slate-950 bg-slate-950 shadow-2xl shadow-blue-900/20 sm:right-12 sm:translate-x-0"
    >
      <div className="overflow-hidden rounded-[30px] bg-white">
        <div className="bg-blue-600 p-5 text-white">
          <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-white/30" />
          <p className="text-sm font-bold text-blue-100">ngantri.id/barber-adi</p>
          <h3 className="mt-2 text-2xl font-black">Barber Adi</h3>
          <p className="mt-1 text-sm text-blue-100">Buka sampai 21.00</p>
        </div>
        <div className="space-y-3 p-4">
          <div className="rounded-[22px] border border-blue-100 bg-blue-50 p-4 text-center">
            <p className="text-xs font-black uppercase tracking-wider text-blue-600">
              Nomor kamu
            </p>
            <p className="mt-1 text-5xl font-black text-blue-700">A-16</p>
            <p className="mt-2 text-sm font-bold text-slate-600">Datang sekitar 18 menit lagi</p>
          </div>
          {["A-13", "A-14", "A-15"].map((code, index) => (
            <motion.div
              key={code}
              animate={{ x: index === 0 ? [0, 4, 0] : 0 }}
              transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
              className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-3 shadow-sm"
            >
              <span className="font-black">{code}</span>
              <span className="text-xs font-bold text-slate-500">
                {index === 0 ? "Sedang siap" : `${index + 1} antrean lagi`}
              </span>
            </motion.div>
          ))}
          <Button className="h-12 w-full rounded-2xl bg-amber-500 font-black text-slate-950 hover:bg-amber-400">
            Ambil nomor
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function BeforeAfterSection() {
  return (
    <section id="cerita" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <SectionIntro
        eyebrow="Sebelum vs Sesudah Ngantri"
        title="Dari 'masih lama?' jadi tahu kapan harus berangkat."
        text="Pelanggan nggak perlu menunggu tanpa kepastian. Bisnis juga nggak perlu balas chat antrean satu-satu."
      />
      <div className="relative mt-10 grid items-stretch gap-5 lg:grid-cols-[1fr_auto_1fr] lg:gap-4">
        <ChaosChatCard />
        <JourneyConnector />
        <LiveQueuePreviewCard />
      </div>
    </section>
  );
}

function ModulesSection() {
  return (
    <section id="fitur" className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="absolute inset-x-0 top-10 -z-10 mx-auto h-[520px] max-w-5xl rounded-full bg-blue-100/40 blur-3xl" />
      <SectionIntro
        eyebrow="Bukan cuma nomor antrean"
        title="Sistem kecil yang terasa hidup di meja admin."
        text="Setiap modul dibuat untuk kebiasaan operasional UMKM: cepat dilihat, mudah diubah, dan jelas untuk pelanggan."
      />
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((item) => (
          <ModuleCard key={item.title} item={item} />
        ))}
      </div>
      <div className="mt-7 grid gap-3 rounded-[26px] border border-slate-100 bg-white/80 p-4 shadow-xl shadow-slate-900/5 backdrop-blur md:grid-cols-4">
        <ModulePromise icon={Zap} title="Ringan & cepat" text="Tampilan realtime" />
        <ModulePromise icon={LockKeyhole} title="Mudah digunakan" text="Tanpa pelatihan rumit" />
        <ModulePromise icon={ShieldCheck} title="Aman & stabil" text="Data bisnis terjaga" />
        <ModulePromise icon={BriefcaseBusiness} title="Dibuat untuk UMKM" text="Harga terjangkau" />
      </div>
    </section>
  );
}

function BusinessSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <SectionIntro
        eyebrow="Untuk bisnis kecil yang sibuk"
        title="Beda layanan, beda ritme antreannya."
        text="Ngantri mengikuti cara kerja bisnis jasa lokal, dari kursi barber sampai bay bengkel."
      />
      <div className="mt-10 rounded-[34px] border border-slate-100 bg-white p-4 shadow-2xl shadow-slate-900/5 sm:p-5">
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <RhythmHero />
          <div className="grid gap-4 sm:grid-cols-2">
            {businesses.map((item) => (
              <BusinessRhythmCard key={item.name} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ModuleCard({ item }: { item: (typeof modules)[number] }) {
  const Icon = item.icon;
  const tone = moduleTones[item.tone as keyof typeof moduleTones];

  return (
    <motion.div
      className={item.wide ? "md:col-span-2 lg:col-span-3" : ""}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.22 }}
    >
      <Card className="h-full overflow-hidden rounded-[28px] border-slate-100 bg-white/90 shadow-xl shadow-slate-900/5 backdrop-blur">
        <CardContent className={`grid h-full gap-5 p-5 ${item.wide ? "lg:grid-cols-[0.9fr_1.5fr] lg:items-center" : ""}`}>
          <div>
            <div className="flex items-start justify-between gap-4">
              <span className={`grid size-12 place-items-center rounded-[18px] ${tone.icon}`}>
                <Icon className="size-5" />
              </span>
              <span className={`rounded-full px-3 py-1 text-xs font-black ${tone.chip}`}>{item.tag}</span>
            </div>
            <h3 className="mt-4 text-lg font-black text-slate-950">{item.title}</h3>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{item.text}</p>
          </div>
          <div className={`rounded-[24px] border p-4 ${tone.preview}`}>{item.fragment}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ModulePromise({
  icon: Icon,
  title,
  text,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-[22px] p-3">
      <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-700">
        <Icon className="size-5" />
      </span>
      <div>
        <p className="text-sm font-black text-slate-950">{title}</p>
        <p className="text-xs font-semibold text-slate-500">{text}</p>
      </div>
    </div>
  );
}

function RhythmHero() {
  return (
    <div className="relative overflow-hidden rounded-[28px] bg-slate-950 p-5 text-white sm:p-6">
      <div className="absolute -right-16 -top-16 size-44 rounded-full bg-blue-500/30 blur-3xl" />
      <div className="absolute -bottom-20 left-10 size-52 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="relative">
        <Badge className="rounded-full bg-white/10 text-white hover:bg-white/10">
          Ritme hari ini
        </Badge>
        <h3 className="mt-5 text-3xl font-black leading-tight">
          Satu sistem, banyak tempo kerja.
        </h3>
        <p className="mt-3 max-w-md text-sm font-semibold leading-7 text-slate-300">
          Kursi barber bisa cepat, treatment salon bisa panjang, bengkel bisa ramai sore.
          Ngantri menjaga estimasi tetap masuk akal untuk tiap layanan.
        </p>
        <div className="mt-7 rounded-[24px] border border-white/10 bg-white/10 p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase text-slate-400">Live operations</p>
              <p className="mt-1 text-xl font-black">4 bisnis aktif</p>
            </div>
            <span className="inline-flex items-center rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-black text-emerald-200">
              <LiveDot />
              Realtime
            </span>
          </div>
          <div className="space-y-3">
            <RhythmRow label="Barber" value="18m" width="w-2/5" color="bg-blue-500" />
            <RhythmRow label="Bengkel" value="2 motor" width="w-3/5" color="bg-amber-400" />
            <RhythmRow label="Dokter" value="09.40" width="w-1/3" color="bg-emerald-400" />
            <RhythmRow label="Salon" value="60m" width="w-5/6" color="bg-rose-400" />
          </div>
        </div>
      </div>
    </div>
  );
}

function BusinessRhythmCard({ item }: { item: (typeof businesses)[number] }) {
  const Icon = item.icon;
  const tone = businessTones[item.tone as keyof typeof businessTones];

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
      <Card className="h-full overflow-hidden rounded-[26px] border-slate-100 bg-slate-50/80 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <span className={`grid size-11 place-items-center rounded-[18px] ${tone.icon}`}>
              <Icon className="size-5" />
            </span>
            <span className={`rounded-full px-3 py-1 text-xs font-black ${tone.chip}`}>{item.lane}</span>
          </div>
          <h3 className="mt-4 text-lg font-black text-slate-950">{item.name}</h3>
          <p className="mt-1 text-sm font-semibold text-slate-500">{item.service}</p>
          <div className="mt-4 rounded-[22px] border border-white bg-white p-3 shadow-sm">
            <div className="mb-3 flex items-center justify-between text-xs font-black uppercase text-slate-400">
              <span>{item.rhythm}</span>
              <span className={tone.text}>{item.wait}</span>
            </div>
            <div className="flex gap-2">
              {item.samples.map((sample, index) => (
                <span
                  key={sample}
                  className={`flex-1 rounded-2xl px-2 py-2 text-center text-xs font-black ${
                    index === 0 ? tone.active : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {sample}
                </span>
              ))}
            </div>
          </div>
          <p className="mt-3 rounded-[18px] bg-white px-3 py-2 text-sm font-black text-slate-700">
            {item.queue}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function RhythmRow({
  label,
  value,
  width,
  color,
}: {
  label: string;
  value: string;
  width: string;
  color: string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs font-black text-slate-300">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-2 rounded-full bg-white/10">
        <div className={`h-full rounded-full ${width} ${color}`} />
      </div>
    </div>
  );
}

function PublicPageSection() {
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-20">
      <div>
        <Badge className="rounded-full bg-blue-50 text-blue-700 hover:bg-blue-50">
          Halaman antrian milik bisnismu
        </Badge>
        <h2 className="mt-5 text-3xl font-black leading-tight sm:text-4xl">
          Setiap bisnis dapat mini website antrean sendiri.
        </h2>
        <p className="mt-5 max-w-xl text-base leading-8 text-slate-600">
          Bagikan link seperti <span className="font-black text-slate-950">ngantri.id/barber-adi</span>.
          Pelanggan bisa lihat jam buka, ambil nomor, cek lokasi, dan pantau antrean dari HP.
        </p>
      </div>
      <Card className="rounded-[32px] border-slate-100 bg-white p-4 shadow-xl shadow-slate-900/5">
        <CardContent className="rounded-[26px] border border-slate-100 bg-slate-50 p-4 sm:p-6">
          <div className="rounded-[24px] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="grid size-12 place-items-center rounded-2xl bg-slate-950 text-sm font-black text-white">
                  BA
                </div>
                <div>
                  <h3 className="font-black">Barber Adi</h3>
                  <p className="text-sm font-semibold text-slate-500">Tebet, Jakarta Selatan</p>
                </div>
              </div>
              <Badge className="rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
                Buka
              </Badge>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[22px] bg-blue-600 p-5 text-white">
                <p className="text-sm font-bold text-blue-100">Sekarang</p>
                <p className="mt-2 text-4xl font-black">A-12</p>
              </div>
              <div className="rounded-[22px] bg-amber-50 p-5">
                <p className="text-sm font-bold text-amber-700">Estimasi</p>
                <p className="mt-2 text-4xl font-black text-slate-950">18m</p>
              </div>
            </div>
            <Button className="mt-4 h-12 w-full rounded-2xl bg-blue-600 font-black hover:bg-blue-700">
              Booking sekarang
            </Button>
            <Tabs defaultValue="antrean" className="mt-4">
              <TabsList className="grid h-12 w-full grid-cols-2 rounded-2xl bg-slate-100 p-1">
                <TabsTrigger value="antrean" className="rounded-xl font-black">
                  Antrean
                </TabsTrigger>
                <TabsTrigger value="info" className="rounded-xl font-black">
                  Info
                </TabsTrigger>
              </TabsList>
              <TabsContent value="antrean" className="mt-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <InfoPill icon={Clock3} text="3 antrean lagi" />
                  <InfoPill icon={TimerReset} text="Datang 18 menit" />
                </div>
              </TabsContent>
              <TabsContent value="info" className="mt-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <InfoPill icon={Clock3} text="09.00-21.00" />
                  <InfoPill icon={MapPin} text="Dekat St. Tebet" />
                </div>
              </TabsContent>
            </Tabs>
            <div className="mt-4 flex items-center justify-between rounded-[22px] bg-slate-100 p-4">
              <span className="text-sm font-black text-slate-600">Tema warna</span>
              <div className="flex gap-2">
                {["bg-blue-600", "bg-amber-500", "bg-emerald-500", "bg-rose-500"].map((dot) => (
                  <span key={dot} className={`size-5 rounded-full ${dot}`} />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function SettingsSection() {
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
      <Card className="order-2 rounded-[32px] border-slate-100 bg-white shadow-xl shadow-slate-900/5 lg:order-1">
        <CardContent className="p-5 sm:p-7">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black">Durasi layanan</h3>
              <p className="text-sm font-semibold text-slate-500">Bisa diubah kapan saja</p>
            </div>
            <div className="grid size-11 place-items-center rounded-2xl bg-blue-50 text-blue-700">
              <Settings2 className="size-5" />
            </div>
          </div>
          <div className="space-y-4">
            {serviceDurations.map(([name, duration, width]) => (
              <div key={name} className="rounded-[22px] border border-slate-100 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-black">{name}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-black text-slate-600">
                    {duration}
                  </span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className={`h-full rounded-full ${width}`} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="order-1 lg:order-2">
        <Badge className="rounded-full bg-amber-50 text-amber-700 hover:bg-amber-50">
          Estimasi yang bisa diatur sendiri
        </Badge>
        <h2 className="mt-5 text-3xl font-black leading-tight sm:text-4xl">
          Karena potong rambut dan coloring jelas beda waktunya.
        </h2>
        <p className="mt-5 max-w-xl text-base leading-8 text-slate-600">
          Admin cukup mengatur durasi layanan. Ngantri menghitung estimasi agar
          pelanggan tahu kapan harus berangkat tanpa menebak-nebak.
        </p>
      </div>
    </section>
  );
}

function WhatsAppSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="rounded-[36px] bg-slate-950 p-5 text-white shadow-2xl shadow-slate-900/15 sm:p-8 lg:p-10">
        <div className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Badge className="rounded-full bg-white/10 text-white hover:bg-white/10">
              Designed for WhatsApp behavior
            </Badge>
            <h2 className="mt-5 text-3xl font-black leading-tight sm:text-4xl">
              Pesannya terasa familiar, bukan seperti sistem yang kaku.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-300">
              Ngantri mengikuti kebiasaan pelanggan Indonesia: cek pesan,
              siap-siap, lalu datang saat waktunya sudah jelas.
            </p>
          </div>
          <div className="rounded-[30px] bg-[#DCF8C6] p-4 sm:p-6">
            <MessageBubble text="Nomor kamu A-16" time="10.12" />
            <MessageBubble text="3 antrean lagi, silakan bersiap." time="10.31" delay />
            <MessageBubble text="Giliranmu sebentar lagi. Jalan sekarang aman." time="10.44" delayLong />
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section id="harga" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <SectionIntro
        eyebrow="Harga UMKM-friendly"
        title="Mulai rapi tanpa biaya yang bikin mikir lama."
        text="Pilih paket yang sesuai dengan ramainya antrean hari ini. Naik kelas saat bisnis makin padat."
      />
      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {pricing.map((plan) => (
          <Card
            key={plan.name}
            className={`rounded-[30px] bg-white shadow-sm ${
              plan.featured ? "border-blue-200 ring-4 ring-blue-100" : "border-slate-100"
            }`}
          >
            <CardContent className="p-6">
              {plan.featured && (
                <Badge className="mb-4 rounded-full bg-blue-600 text-white hover:bg-blue-600">
                  Paling pas
                </Badge>
              )}
              <h3 className="text-xl font-black">{plan.name}</h3>
              <p className="mt-3 text-3xl font-black">{plan.price}</p>
              <p className="mt-3 min-h-12 text-sm leading-6 text-slate-600">{plan.note}</p>
              <div className="mt-6 space-y-3">
                {plan.items.map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                      <Check className="size-4" />
                    </span>
                    {item}
                  </div>
                ))}
              </div>
              <Button
                className={`mt-7 h-12 w-full rounded-2xl font-black ${
                  plan.featured
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-slate-950 text-white hover:bg-slate-800"
                }`}
              >
                Pilih {plan.name}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pb-24">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[40px] bg-blue-600 p-8 text-white shadow-2xl shadow-blue-600/20 sm:p-12 lg:p-16">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="text-sm font-black uppercase tracking-wider text-blue-100">
              Datang pas giliranmu
            </p>
            <h2 className="mt-4 max-w-3xl text-3xl font-black leading-tight sm:text-5xl">
              Biar pelanggan nggak nunggu tanpa kepastian.
            </h2>
          </div>
          <Button className="h-14 rounded-[20px] bg-white px-8 text-base font-black text-blue-700 hover:bg-blue-50">
            Mulai pakai Ngantri
            <ArrowRight className="ml-2 size-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}

function QueueJourney() {
  const steps = ["Ambil nomor", "Tunggu di rumah", "Berangkat", "Dilayani"];
  return (
    <div className="mt-9 max-w-xl rounded-[24px] border border-white bg-white/75 p-4 shadow-sm backdrop-blur">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-black text-slate-700">Alur pelanggan</span>
        <span className="text-xs font-bold text-emerald-600">Lebih tenang</span>
      </div>
      <div className="relative grid grid-cols-4 gap-2">
        <div className="absolute left-[11%] right-[11%] top-4 h-1 rounded-full bg-slate-100" />
        <motion.div
          animate={{ width: ["20%", "68%", "82%"] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[11%] top-4 h-1 rounded-full bg-blue-600"
        />
        {steps.map((step, index) => (
          <div key={step} className="relative z-10 text-center">
            <div
              className={`mx-auto grid size-9 place-items-center rounded-full text-xs font-black ${
                index < 3 ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"
              }`}
            >
              {index + 1}
            </div>
            <p className="mt-2 text-[11px] font-bold leading-4 text-slate-600 sm:text-xs">{step}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionIntro({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <Badge className="rounded-full bg-blue-50 px-4 py-2 text-blue-700 hover:bg-blue-50">
        {eyebrow}
      </Badge>
      <h2 className="mt-5 text-3xl font-black leading-tight sm:text-4xl">{title}</h2>
      <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-600">{text}</p>
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-[22px] border border-slate-100 bg-slate-50 p-4">
      <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white text-blue-700 shadow-sm">
        <Icon className="size-5" />
      </div>
      <div>
        <p className="text-xs font-bold text-slate-500">{label}</p>
        <p className="font-black text-slate-950">{value}</p>
      </div>
    </div>
  );
}

function ChaosChatCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.24 }}
    >
      <Card className="relative h-full overflow-hidden rounded-[28px] border-red-100 bg-gradient-to-br from-red-50 via-orange-50 to-white shadow-xl shadow-red-950/5">
        <CardContent className="relative min-h-[520px] p-5 sm:p-7">
          <div className="absolute -right-10 top-10 size-36 rounded-full bg-orange-200/30 blur-3xl" />
          <div className="absolute -bottom-12 -left-10 size-44 rounded-full bg-red-200/30 blur-3xl" />
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <SectionBadge tone="danger" icon={AlertTriangle} text="Sebelum" />
              <h3 className="mt-4 text-2xl font-black leading-tight text-slate-950">
                Antrian manual bikin pelanggan dan admin sama-sama capek.
              </h3>
            </div>
            <StatusChip tone="danger" text="Tidak pasti" />
          </div>

          <div className="relative mt-7 rounded-[24px] border border-white/80 bg-white/70 p-4 shadow-sm">
            <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="grid size-9 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                <MessageCircle className="size-4" />
              </span>
              <div>
                <p className="text-sm font-black">Chat pelanggan</p>
                <p className="text-xs font-bold text-slate-400">Barber Adi, 10.18</p>
              </div>
            </div>
            <MessyChatBubble text="Mas, masih lama?" />
            <MessyChatBubble admin text="Sebentar ya kak, saya cek dulu." />
            <MessyChatBubble text="Kalau datang sekarang aman nggak?" />
          </div>

          <div className="relative mt-5 grid gap-3 sm:grid-cols-[0.95fr_1.05fr]">
            <TiltedNote className="-rotate-2" title="Catatan meja" text="A-13? A-14? booking jam 11.00" />
            <TiltedNote
              className="rotate-2 sm:mt-7"
              danger
              title="Tumpang tindih"
              text="Booking dobel karena catatan manual."
            />
          </div>

          <div className="relative mt-5 grid gap-3">
            <WarningStrip text="Datang langsung, ternyata masih 8 orang." />
            <WarningStrip text="Admin bolak-balik cek urutan dan balas chat." orange />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function LiveQueuePreviewCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.24, delay: 0.12 }}
    >
      <Card className="relative h-full overflow-hidden rounded-[28px] border-emerald-100 bg-gradient-to-br from-emerald-50 via-blue-50 to-white shadow-xl shadow-emerald-950/5">
        <CardContent className="relative min-h-[520px] p-5 sm:p-7">
          <div className="absolute -right-12 -top-10 size-44 rounded-full bg-blue-200/40 blur-3xl" />
          <div className="absolute -bottom-16 left-12 size-48 rounded-full bg-emerald-200/40 blur-3xl" />
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <SectionBadge tone="success" icon={CheckCircle2} text="Sesudah" />
              <h3 className="mt-4 text-2xl font-black leading-tight text-slate-950">
                Semua orang tahu posisi antrean, estimasi waktu, dan kapan harus datang.
              </h3>
            </div>
            <StatusChip tone="success" text="Realtime & jelas" />
          </div>

          <div className="relative mx-auto mt-7 max-w-sm rounded-[30px] border border-slate-200 bg-slate-950 p-3 shadow-2xl shadow-blue-950/15">
            <div className="rounded-[24px] bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase text-slate-400">Nomor kamu</p>
                  <p className="mt-1 text-4xl font-black text-blue-600">A-16</p>
                </div>
                <StatusChip tone="success" text="Live" compact />
              </div>
              <div className="mt-5 rounded-[22px] bg-blue-600 p-4 text-white">
                <div className="flex items-center gap-2 text-sm font-bold text-blue-100">
                  <Radio className="size-4" />
                  Sekarang dilayani
                </div>
                <p className="mt-2 text-3xl font-black">A-13</p>
              </div>
              <QueueProgressMini />
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <InfoPill icon={Ticket} text="3 antrean lagi" />
                <InfoPill icon={Clock3} text="18 menit" />
              </div>
            </div>
          </div>

          <div className="relative mt-5 grid gap-3 sm:grid-cols-2">
            <SuccessTile label="Estimasi datang" value="18 menit" />
            <SuccessTile label="Pesan otomatis" value="Berangkat sekarang" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function JourneyConnector() {
  return (
    <div className="flex items-center justify-center py-1 lg:px-1">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="z-10 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-3 text-sm font-black text-blue-700 shadow-xl shadow-blue-950/10 lg:max-w-[132px] lg:flex-col lg:rounded-[24px] lg:text-center"
      >
        <span>Dari nebak-nebak</span>
        <ArrowRight className="size-4 rotate-90 lg:rotate-0" />
        <span>jadi pasti</span>
      </motion.div>
    </div>
  );
}

function SectionBadge({
  icon: Icon,
  text,
  tone,
}: {
  icon: LucideIcon;
  text: string;
  tone: "danger" | "success";
}) {
  return (
    <Badge
      className={`rounded-full px-3 py-1.5 font-black hover:bg-current ${
        tone === "danger" ? "bg-red-100 text-red-700 hover:bg-red-100" : "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
      }`}
    >
      <Icon className="mr-2 size-4" />
      {text}
    </Badge>
  );
}

function StatusChip({
  text,
  tone,
  compact,
}: {
  text: string;
  tone: "danger" | "success";
  compact?: boolean;
}) {
  const isSuccess = tone === "success";
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-2 rounded-full border bg-white px-3 py-1.5 text-xs font-black shadow-sm ${
        isSuccess ? "border-emerald-100 text-emerald-700" : "border-orange-100 text-orange-700"
      }`}
    >
      {isSuccess ? <LiveDot /> : <span className="size-2 rounded-full bg-orange-500" />}
      {!compact && text}
      {compact && <span>{text}</span>}
    </span>
  );
}

function MessyChatBubble({ text, admin }: { text: string; admin?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: admin ? -10 : 10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className={`mb-3 max-w-[86%] rounded-[22px] p-3 text-sm font-bold leading-6 shadow-sm ${
        admin
          ? "rounded-bl-md bg-slate-100 text-slate-700"
          : "ml-auto rounded-br-md bg-white text-slate-950"
      }`}
    >
      {text}
    </motion.div>
  );
}

function TiltedNote({
  title,
  text,
  className,
  danger,
}: {
  title: string;
  text: string;
  className?: string;
  danger?: boolean;
}) {
  return (
    <div
      className={`rounded-[22px] border bg-white p-4 shadow-sm ${className ?? ""} ${
        danger ? "border-red-100" : "border-orange-100"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-black uppercase text-slate-400">{title}</p>
        <span className={`h-2 w-8 rounded-full ${danger ? "bg-red-400" : "bg-orange-400"}`} />
      </div>
      <p className="mt-3 text-sm font-black leading-6 text-slate-800 line-through decoration-red-400 decoration-2">
        {text}
      </p>
    </div>
  );
}

function WarningStrip({ text, orange }: { text: string; orange?: boolean }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-[20px] border p-3 text-sm font-black ${
        orange ? "border-orange-100 bg-orange-100/70 text-orange-800" : "border-red-100 bg-red-100/70 text-red-800"
      }`}
    >
      <AlertTriangle className="size-4 shrink-0" />
      {text}
    </div>
  );
}

function QueueProgressMini() {
  return (
    <div className="mt-4">
      <div className="mb-2 flex items-center justify-between text-xs font-black text-slate-500">
        <span>A-13</span>
        <span>A-16</span>
      </div>
      <div className="h-3 rounded-full bg-slate-100">
        <motion.div
          initial={{ width: "38%" }}
          whileInView={{ width: "76%" }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-blue-600 to-emerald-500"
        />
      </div>
      <p className="mt-3 text-sm font-black text-emerald-700">Silakan berangkat sekarang</p>
    </div>
  );
}

function SuccessTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-emerald-100 bg-white/80 p-4 shadow-sm">
      <p className="text-xs font-black uppercase text-slate-400">{label}</p>
      <p className="mt-2 font-black text-slate-950">{value}</p>
    </div>
  );
}

function FloatingTicket({
  className,
  code,
  label,
  orange,
  green,
}: {
  className: string;
  code: string;
  label: string;
  orange?: boolean;
  green?: boolean;
}) {
  return (
    <motion.div
      animate={{ y: [0, -12, 0] }}
      transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      className={`absolute z-10 hidden rounded-[22px] border bg-white p-4 shadow-xl shadow-slate-900/10 sm:block ${className}`}
    >
      <p
        className={`text-2xl font-black ${
          orange ? "text-amber-600" : green ? "text-emerald-600" : "text-blue-600"
        }`}
      >
        {code}
      </p>
      <p className="mt-1 text-xs font-bold text-slate-500">{label}</p>
    </motion.div>
  );
}

function LiveDot() {
  return (
    <span className="relative mr-2 flex size-2">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
      <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
    </span>
  );
}

function MessageBubble({ text, time, delay, delayLong }: { text: string; time: string; delay?: boolean; delayLong?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: delayLong ? 0.35 : delay ? 0.18 : 0 }}
      className="mb-3 ml-auto max-w-[88%] rounded-[22px] rounded-br-md bg-white p-4 text-slate-950 shadow-sm"
    >
      <p className="font-bold">{text}</p>
      <p className="mt-1 text-right text-xs font-semibold text-slate-400">{time}</p>
    </motion.div>
  );
}

function InfoPill({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-white p-3 text-sm font-black text-slate-600">
      <Icon className="size-4 text-blue-600" />
      {text}
    </div>
  );
}

function QueueMini({ now, next }: { now: string; next: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between rounded-2xl bg-white p-3 shadow-sm">
        <span className="text-xs font-black">Sekarang</span>
        <span className="font-black">{now}</span>
      </div>
      <div className="flex items-center justify-between rounded-2xl bg-blue-600 p-3 text-white shadow-sm">
        <span className="text-xs font-black">Berikutnya</span>
        <span className="font-black">{next}</span>
      </div>
    </div>
  );
}

function TimeMini() {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2 text-sm font-black">
        <Clock3 className="size-4" />
        18 menit lagi
      </div>
      <div className="h-3 rounded-full bg-white">
        <div className="h-full w-2/3 rounded-full bg-amber-500" />
      </div>
    </div>
  );
}

function BookingMini() {
  return (
    <div className="grid grid-cols-3 gap-2">
      {["10.00", "10.20", "10.40"].map((time, index) => (
        <div
          key={time}
          className={`rounded-2xl p-3 text-center text-xs font-black ${
            index === 1 ? "bg-emerald-500 text-white" : "bg-white"
          }`}
        >
          {time}
        </div>
      ))}
    </div>
  );
}

function PageMini() {
  return (
    <div className="rounded-2xl bg-white p-3 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <Store className="size-4" />
        <span className="text-xs font-black">barber-adi</span>
      </div>
      <div className="h-2 rounded-full bg-slate-200">
        <div className="h-full w-3/5 rounded-full bg-slate-900" />
      </div>
    </div>
  );
}

function ChatMini() {
  return (
    <div className="space-y-2">
      <div className="w-4/5 rounded-2xl bg-white p-3 text-xs font-black shadow-sm">Nomor kamu A-16</div>
      <div className="ml-auto w-4/5 rounded-2xl bg-emerald-500 p-3 text-xs font-black text-white shadow-sm">
        3 antrean lagi
      </div>
    </div>
  );
}

function StaffMini() {
  return (
    <div className="grid grid-cols-3 gap-2">
      {["K1", "K2", "K3"].map((staff, index) => (
        <div key={staff} className="rounded-2xl bg-white p-3 text-center shadow-sm">
          <div className={`mx-auto mb-2 size-3 rounded-full ${index === 1 ? "bg-emerald-500" : "bg-amber-500"}`} />
          <p className="text-xs font-black">{staff}</p>
        </div>
      ))}
    </div>
  );
}

function ChartMini() {
  return (
    <div className="flex h-20 items-end gap-2 rounded-2xl bg-white p-3 shadow-sm">
      {["h-8", "h-12", "h-7", "h-14", "h-10"].map((height, index) => (
        <div key={`${height}-${index}`} className={`flex-1 rounded-t-xl bg-indigo-500 ${height}`} />
      ))}
    </div>
  );
}

function BackgroundAtmosphere() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[520px] bg-[linear-gradient(120deg,rgba(37,99,235,0.12),transparent_34%,rgba(245,158,11,0.12)_64%,transparent)]" />
      <div className="absolute inset-x-0 top-[760px] h-[420px] bg-[linear-gradient(150deg,transparent,rgba(16,185,129,0.12)_40%,transparent_72%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(17,24,39,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(17,24,39,0.035)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent_82%)]" />
    </div>
  );
}
