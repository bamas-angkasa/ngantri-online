"use client";

import { Clock3 } from "lucide-react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { Card, CardContent } from "@/components/ui/card";
import { fetchQueue } from "@/lib/api/queue";

const statusCopy = {
  waiting: "Nomor kamu sudah masuk antrean.",
  called: "Giliranmu dipanggil. Silakan menuju lokasi.",
  serving: "Kamu sedang dilayani.",
  completed: "Layanan selesai. Terima kasih sudah datang.",
  skipped: "Nomor ini dilewati.",
  cancelled: "Antrean ini dibatalkan.",
  no_show: "Nomor ini ditandai tidak hadir.",
};

export default function QueueStatusPage() {
  const params = useParams<{ queueId: string }>();
  const { data, isLoading, error } = useQuery({
    queryKey: ["queue", params.queueId],
    queryFn: () => fetchQueue(params.queueId),
    refetchInterval: 15000,
  });

  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 py-10 text-foreground">
      <Card className="w-full max-w-md rounded-[28px] shadow-xl shadow-slate-900/5 dark:shadow-black/20">
        <CardContent className="p-6 text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Clock3 className="size-7" />
          </div>
          <p className="mt-5 text-sm font-black uppercase text-muted-foreground">Status antrean</p>
          {isLoading && <p className="mt-6 text-sm font-bold text-muted-foreground">Memuat status...</p>}
          {error && <p className="mt-6 text-sm font-bold text-destructive">Status antrean tidak ditemukan.</p>}
          {data && (
            <>
              <h1 className="mt-2 text-5xl font-black">{data.queueNumber}</h1>
              <p className="mt-3 font-semibold text-muted-foreground">Estimasi {data.estimatedWaitMinutes} menit</p>
              <div className="mt-6 rounded-2xl bg-emerald-50 p-4 font-black text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                {statusCopy[data.status]}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
