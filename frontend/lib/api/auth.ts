import { apiRequest } from "@/lib/api/client";
import { clearAuthToken, saveAuthToken } from "@/lib/auth/session";
import type { User } from "@/lib/contracts";
import type { LoginInput, RegisterInput } from "@/lib/validation/auth";

export type LoginResponse = {
  token: string;
  expiresAt: string;
  user: User;
};

export async function login(input: LoginInput) {
  const session = await apiRequest<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
  saveAuthToken(session.token);
  return session;
}

export async function register(input: RegisterInput) {
  const session = await apiRequest<LoginResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
  saveAuthToken(session.token);
  return session;
}

export async function logout() {
  await apiRequest("/api/auth/logout", {
    method: "POST",
  }).catch(() => undefined);
  clearAuthToken();
}

export async function getCurrentUser() {
  return apiRequest<User>("/api/me");
}
