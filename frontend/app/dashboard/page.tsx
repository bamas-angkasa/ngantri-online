"use client";

import { CheckCircle2, Clock3, Scissors, Users } from "lucide-react";

import { DashboardShell } from "@/components/ngantri/dashboard-shell";
import { MetricCard } from "@/components/ngantri/metric-card";
import { StaffLaneQueueBoard } from "@/components/ngantri/live-queue-board";
import { useDemoDashboard } from "@/lib/api/queries";

export default function DashboardPage() {
  const { data } = useDemoDashboard();
  return (
    <DashboardShell title="Overview" description="Ringkasan operasional Barber Adi hari ini.">
      {data && (
        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard icon={Users} label="Total antrean hari ini" value={data.analytics.totalQueuesToday} />
            <MetricCard icon={Clock3} label="Sedang menunggu" value={data.analytics.currentlyWaiting} tone="orange" />
            <MetricCard icon={CheckCircle2} label="Selesai hari ini" value={data.analytics.completedToday} tone="green" />
            <MetricCard icon={Scissors} label="Top service" value={data.analytics.topService} tone="slate" />
          </div>
          <StaffLaneQueueBoard staff={data.staff} queues={data.queues} />
        </div>
      )}
    </DashboardShell>
  );
}
