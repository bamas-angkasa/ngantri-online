"use client";

import { CalendarClock, Clock3, MapPin, QrCode, Scissors } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StaffLaneQueueBoard } from "@/components/ngantri/live-queue-board";
import { useDemoPublicBusiness } from "@/lib/api/queries";

export function PublicBusinessPage({ branchSlug }: { branchSlug?: string }) {
  const { data } = useDemoPublicBusiness();

  if (!data) {
    return null;
  }

  const branch = data.branches.find((item) => item.slug === branchSlug) ?? data.branches[0];
  const branchQueues = data.queues.filter((queue) => queue.branchId === branch.id);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="bg-primary px-4 py-8 text-primary-foreground sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Badge className="rounded-full bg-white/15 text-white hover:bg-white/15">Live</Badge>
          <h1 className="mt-4 text-4xl font-black">{data.business.name}</h1>
          <p className="mt-2 max-w-xl text-primary-foreground/80">Datang pas giliranmu. Cek antrean realtime dan ambil nomor dari HP.</p>
        </div>
      </section>

      <section className="mx-auto -mt-6 grid max-w-6xl gap-5 px-4 pb-12 sm:px-6 lg:grid-cols-[1fr_340px] lg:px-8">
        <div className="space-y-5">
          <Card className="rounded-[28px] border-0 shadow-xl shadow-slate-900/10 dark:shadow-black/20">
            <CardContent className="grid gap-4 p-5 sm:grid-cols-3">
              <Info icon={MapPin} label="Cabang" value={branch.name} />
              <Info icon={Clock3} label="Sekarang Dilayani" value="A-01" />
              <Info icon={CalendarClock} label="Estimasi" value="18 menit" />
            </CardContent>
          </Card>
          <StaffLaneQueueBoard staff={data.staff} queues={branchQueues} />
        </div>

        <Card className="h-fit rounded-[28px] shadow-sm">
          <CardContent className="p-5">
            <div className="grid size-16 place-items-center rounded-3xl bg-primary/10 text-primary">
              <Scissors className="size-8" />
            </div>
            <h2 className="mt-5 text-2xl font-black">Pilih layanan</h2>
            <div className="mt-4 space-y-3">
              {data.services.map((service) => (
                <div key={service.id} className="flex items-center justify-between rounded-2xl border border-border p-4">
                  <div>
                    <p className="font-black">{service.name}</p>
                    <p className="text-sm font-semibold text-muted-foreground">{service.durationMinutes} menit</p>
                  </div>
                  <span className="text-sm font-black text-primary">Rp{service.price?.toLocaleString("id-ID")}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 grid gap-3">
              <Button className="h-12 rounded-2xl font-black">Ambil Nomor</Button>
              <Button variant="outline" className="h-12 rounded-2xl font-black">Booking Online</Button>
            </div>
            <div className="mt-5 flex items-center gap-3 rounded-2xl bg-muted p-4">
              <QrCode className="size-5 text-primary" />
              <p className="text-sm font-bold text-muted-foreground">QR cabang siap dicetak dari dashboard.</p>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

function Info({ icon: Icon, label, value }: { icon: typeof Clock3; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-[22px] bg-muted p-4">
      <span className="grid size-11 place-items-center rounded-2xl bg-card text-primary shadow-sm">
        <Icon className="size-5" />
      </span>
      <div>
        <p className="text-xs font-bold text-muted-foreground">{label}</p>
        <p className="font-black">{value}</p>
      </div>
    </div>
  );
}
