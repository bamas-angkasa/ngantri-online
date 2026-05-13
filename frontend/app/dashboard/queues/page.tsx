"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { DashboardShell } from "@/components/ngantri/dashboard-shell";
import { StaffLaneQueueBoard } from "@/components/ngantri/live-queue-board";
import { callNextQueue, updateQueueStatus } from "@/lib/api/queue";
import { useDashboardData } from "@/lib/api/queries";

export default function DashboardQueuesPage() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useDashboardData();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["dashboard"] });
  const callNext = useMutation({ mutationFn: ({ branchId, staffId }: { branchId: string; staffId: string }) => callNextQueue(branchId, staffId), onSuccess: invalidate });
  const updateStatus = useMutation({ mutationFn: ({ queueId, status }: { queueId: string; status: "serving" | "completed" }) => updateQueueStatus(queueId, status), onSuccess: invalidate });

  return (
    <DashboardShell title="Live Queue" description="Panggil, layani, skip, atau selesaikan antrean per staff.">
      {isLoading && <p className="text-sm font-bold text-muted-foreground">Memuat antrean...</p>}
      {error && <p className="text-sm font-bold text-destructive">Antrean belum bisa dimuat. Pastikan API dan database sudah berjalan.</p>}
      {data && (
        <StaffLaneQueueBoard
          staff={data.staff}
          queues={data.queues}
          onCallNext={(staffId) => callNext.mutate({ branchId: data.activeBranch.id, staffId })}
          onStartServing={(queueId) => updateStatus.mutate({ queueId, status: "serving" })}
          onComplete={(queueId) => updateStatus.mutate({ queueId, status: "completed" })}
        />
      )}
    </DashboardShell>
  );
}
