import { apiRequest } from "@/lib/api/client";
import type { QueueItem, QueueStatus } from "@/lib/contracts";

export type CreateQueueInput = {
  branchId: string;
  serviceId: string;
  staffId?: string;
  customerName?: string;
  customerEmail?: string;
  source?: "walk_in" | "online";
};

export async function createQueue(input: CreateQueueInput) {
  const { branchId, ...body } = input;
  return apiRequest<QueueItem>(`/api/branches/${branchId}/queues`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function callNextQueue(branchId: string, staffId?: string) {
  return apiRequest<QueueItem>(`/api/branches/${branchId}/queues/call-next`, {
    method: "POST",
    body: JSON.stringify({ staffId }),
  });
}

export async function updateQueueStatus(queueId: string, status: QueueStatus) {
  return apiRequest<QueueItem>(`/api/queues/${queueId}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}
