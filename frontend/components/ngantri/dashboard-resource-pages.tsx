"use client";

import { BarChart3, Building2, CalendarClock, CreditCard, QrCode, Scissors, Settings, Users } from "lucide-react";

import { DashboardShell } from "@/components/ngantri/dashboard-shell";
import { MetricCard } from "@/components/ngantri/metric-card";
import { Card, CardContent } from "@/components/ui/card";
import { useDashboardData } from "@/lib/api/queries";

function StateMessage({ message, tone = "muted" }: { message: string; tone?: "muted" | "error" }) {
  return <p className={tone === "error" ? "text-sm font-bold text-destructive" : "text-sm font-bold text-muted-foreground"}>{message}</p>;
}

export function BranchesPage() {
  const { data, isLoading, error } = useDashboardData();
  return (
    <DashboardShell title="Branches" description="Kelola cabang yang aktif di halaman publik.">
      {isLoading && <StateMessage message="Memuat cabang..." />}
      {error && <StateMessage tone="error" message="Cabang belum bisa dimuat." />}
      <div className="grid gap-4 md:grid-cols-2">
        {data?.branches.map((branch) => (
          <Card key={branch.id} className="rounded-[24px] shadow-sm">
            <CardContent className="p-5">
              <Building2 className="size-6 text-primary" />
              <h2 className="mt-4 text-xl font-black">{branch.name}</h2>
              <p className="mt-1 text-sm font-semibold text-muted-foreground">/{data.business.slug}/{branch.slug}</p>
              <p className="mt-3 text-sm font-bold">{branch.address ?? "Alamat belum diisi"}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardShell>
  );
}

export function StaffPage() {
  const { data, isLoading, error } = useDashboardData();
  return (
    <DashboardShell title="Staff" description="Pantau staff dan lane layanan aktif.">
      {isLoading && <StateMessage message="Memuat staff..." />}
      {error && <StateMessage tone="error" message="Staff belum bisa dimuat." />}
      <div className="grid gap-4 md:grid-cols-3">
        {data?.staff.map((person) => (
          <Card key={person.id} className="rounded-[24px] shadow-sm">
            <CardContent className="p-5">
              <Users className="size-6 text-primary" />
              <h2 className="mt-4 text-xl font-black">{person.name}</h2>
              <p className="text-sm font-semibold text-muted-foreground">{person.roleLabel}</p>
              <p className="mt-3 text-sm font-black">{person.isAvailable ? "Aktif" : "Istirahat"}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardShell>
  );
}

export function ServicesPage() {
  const { data, isLoading, error } = useDashboardData();
  return (
    <DashboardShell title="Services" description="Layanan, durasi, dan harga yang dipakai estimasi antrean.">
      {isLoading && <StateMessage message="Memuat layanan..." />}
      {error && <StateMessage tone="error" message="Layanan belum bisa dimuat." />}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data?.services.map((service) => (
          <Card key={service.id} className="rounded-[24px] shadow-sm">
            <CardContent className="p-5">
              <Scissors className="size-6 text-primary" />
              <h2 className="mt-4 text-lg font-black">{service.name}</h2>
              <p className="mt-1 text-sm font-semibold text-muted-foreground">{service.durationMinutes} menit</p>
              <p className="mt-3 text-sm font-black">Rp{service.price?.toLocaleString("id-ID") ?? "-"}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardShell>
  );
}

export function BookingsPage() {
  const { data, isLoading, error } = useDashboardData();
  return (
    <DashboardShell title="Bookings" description="Booking terjadwal dan status check-in.">
      {isLoading && <StateMessage message="Memuat booking..." />}
      {error && <StateMessage tone="error" message="Booking belum bisa dimuat." />}
      <div className="space-y-3">
        {data?.bookings.length === 0 && <StateMessage message="Belum ada booking." />}
        {data?.bookings.map((booking) => (
          <Card key={booking.id} className="rounded-[20px] shadow-sm">
            <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="font-black">{booking.bookingCode}</p>
                <p className="text-sm font-semibold text-muted-foreground">{new Date(booking.startTime).toLocaleString("id-ID")}</p>
              </div>
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-black">{booking.status}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardShell>
  );
}

export function CustomersPage() {
  const { data, isLoading, error } = useDashboardData();
  const customerIds = Array.from(new Set([...(data?.queues.map((queue) => queue.customerId) ?? []), ...(data?.bookings.map((booking) => booking.customerId) ?? [])]));
  return (
    <DashboardShell title="Customers" description="Customer yang muncul dari antrean dan booking.">
      {isLoading && <StateMessage message="Memuat customer..." />}
      {error && <StateMessage tone="error" message="Customer belum bisa dimuat." />}
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard icon={Users} label="Total customer unik" value={customerIds.length} />
        <MetricCard icon={CalendarClock} label="Dari booking" value={data?.bookings.length ?? 0} tone="orange" />
        <MetricCard icon={BarChart3} label="Dari antrean hari ini" value={data?.queues.length ?? 0} tone="green" />
      </div>
    </DashboardShell>
  );
}

export function AnalyticsPage() {
  const { data, isLoading, error } = useDashboardData();
  return (
    <DashboardShell title="Analytics" description="Ringkasan sederhana performa antrean hari ini.">
      {isLoading && <StateMessage message="Memuat analytics..." />}
      {error && <StateMessage tone="error" message="Analytics belum bisa dimuat." />}
      {data && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard icon={BarChart3} label="Rata-rata tunggu" value={`${data.analytics.averageWaitMinutes}m`} />
          <MetricCard icon={Users} label="Menunggu" value={data.analytics.currentlyWaiting} tone="orange" />
          <MetricCard icon={CalendarClock} label="Jam ramai" value={data.analytics.busiestHour} tone="slate" />
          <MetricCard icon={Scissors} label="Layanan favorit" value={data.analytics.topService} tone="green" />
        </div>
      )}
    </DashboardShell>
  );
}

export function QRPage() {
  const { data, isLoading, error } = useDashboardData();
  return (
    <DashboardShell title="QR Code" description="Link publik cabang yang siap ditempel di poster atau meja kasir.">
      {isLoading && <StateMessage message="Memuat QR..." />}
      {error && <StateMessage tone="error" message="QR belum bisa dimuat." />}
      {data && (
        <Card className="max-w-xl rounded-[24px] shadow-sm">
          <CardContent className="p-5">
            <QrCode className="size-8 text-primary" />
            <h2 className="mt-4 text-xl font-black">{data.activeBranch.name}</h2>
            <p className="mt-2 break-all rounded-2xl bg-muted p-4 text-sm font-bold text-muted-foreground">{data.qrUrl ?? `/${data.business.slug}/${data.activeBranch.slug}`}</p>
          </CardContent>
        </Card>
      )}
    </DashboardShell>
  );
}

export function SubscriptionPage() {
  const { data, isLoading, error } = useDashboardData();
  return (
    <DashboardShell title="Subscription" description="Paket aktif dan limit antrean.">
      {isLoading && <StateMessage message="Memuat subscription..." />}
      {error && <StateMessage tone="error" message="Subscription belum bisa dimuat." />}
      {data && (
        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard icon={CreditCard} label="Paket" value={data.business.subscriptionPlan} />
          <MetricCard icon={Users} label="Antrean bulan ini" value={data.analytics.totalQueuesToday} tone="orange" />
          <MetricCard icon={Building2} label="Cabang aktif" value={data.branches.length} tone="green" />
        </div>
      )}
    </DashboardShell>
  );
}

export function ThemePage() {
  return (
    <DashboardShell title="Theme" description="Logo, warna, dan template halaman publik.">
      <Card className="max-w-xl rounded-[24px] shadow-sm">
        <CardContent className="p-5">
          <Settings className="size-7 text-primary" />
          <h2 className="mt-4 text-xl font-black">Tema dasar aktif</h2>
          <p className="mt-2 text-sm font-semibold text-muted-foreground">Endpoint tema sudah tersedia untuk menyimpan template, warna utama, warna sekunder, dan logo.</p>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}

export function SettingsPage() {
  const { data } = useDashboardData();
  return (
    <DashboardShell title="Settings" description="Identitas bisnis dan pengaturan operasional.">
      <Card className="max-w-xl rounded-[24px] shadow-sm">
        <CardContent className="p-5">
          <Settings className="size-7 text-primary" />
          <h2 className="mt-4 text-xl font-black">{data?.business.name ?? "Bisnis"}</h2>
          <p className="mt-2 text-sm font-semibold text-muted-foreground">Pengaturan detail bisa ditambahkan di atas endpoint business, branch, service, dan theme yang sudah aktif.</p>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
