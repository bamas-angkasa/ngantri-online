import type { ApiEnvelope } from "@/lib/contracts";
import { getAuthToken } from "@/lib/auth/session";

const apiBaseURL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export class APIClientError extends Error {
  constructor(
    message: string,
    public status: number,
    public code = "api_error",
  ) {
    super(message);
  }
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${apiBaseURL}${path}`, {
    ...init,
    headers,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new APIClientError(
      payload?.message ?? "Request gagal. Coba lagi sebentar.",
      response.status,
      payload?.code,
    );
  }

  return (payload as ApiEnvelope<T>).data ?? payload;
}
