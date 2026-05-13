"use client";

import { DashboardShell } from "@/components/ngantri/dashboard-shell";
import { StaffLaneQueueBoard } from "@/components/ngantri/live-queue-board";
import { useDemoDashboard } from "@/lib/api/queries";

export default function DashboardQueuesPage() {
  const { data } = useDemoDashboard();
  return (
    <DashboardShell title="Live Queue" description="Panggil, layani, skip, atau selesaikan antrean per staff.">
      {data && <StaffLaneQueueBoard staff={data.staff} queues={data.queues} />}
    </DashboardShell>
  );
}
