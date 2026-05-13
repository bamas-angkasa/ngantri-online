"use client";

import { CheckCircle2, Clock3, Scissors, Users } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { DashboardShell } from "@/components/ngantri/dashboard-shell";
import { MetricCard } from "@/components/ngantri/metric-card";
import { StaffLaneQueueBoard } from "@/components/ngantri/live-queue-board";
import { callNextQueue, updateQueueStatus } from "@/lib/api/queue";
import { useDashboardData } from "@/lib/api/queries";

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useDashboardData();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["dashboard"] });
  const callNext = useMutation({ mutationFn: ({ branchId, staffId }: { branchId: string; staffId: string }) => callNextQueue(branchId, staffId), onSuccess: invalidate });
  const updateStatus = useMutation({ mutationFn: ({ queueId, status }: { queueId: string; status: "serving" | "completed" }) => updateQueueStatus(queueId, status), onSuccess: invalidate });

  return (
    <DashboardShell title="Overview" description={data ? `Ringkasan operasional ${data.business.name} hari ini.` : "Ringkasan operasional hari ini."}>
      {isLoading && <p className="text-sm font-bold text-muted-foreground">Memuat dashboard...</p>}
      {error && <p className="text-sm font-bold text-destructive">Dashboard belum bisa dimuat. Pastikan API dan database sudah berjalan.</p>}
      {data && (
        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard icon={Users} label="Total antrean hari ini" value={data.analytics.totalQueuesToday} />
            <MetricCard icon={Clock3} label="Sedang menunggu" value={data.analytics.currentlyWaiting} tone="orange" />
            <MetricCard icon={CheckCircle2} label="Selesai hari ini" value={data.analytics.completedToday} tone="green" />
            <MetricCard icon={Scissors} label="Top service" value={data.analytics.topService} tone="slate" />
          </div>
          <StaffLaneQueueBoard
            staff={data.staff}
            queues={data.queues}
            onCallNext={(staffId) => callNext.mutate({ branchId: data.activeBranch.id, staffId })}
            onStartServing={(queueId) => updateStatus.mutate({ queueId, status: "serving" })}
            onComplete={(queueId) => updateStatus.mutate({ queueId, status: "completed" })}
          />
        </div>
      )}
    </DashboardShell>
  );
}
