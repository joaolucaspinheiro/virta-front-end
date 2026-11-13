import { env } from "@/config/env";

/**
 * Either logged in (token filled) or, when the account has two-step verification,
 * totpRequired + challengeToken (a 5-minute ticket for the code step).
 */
export interface LoginResponse {
  token: string | null;
  id: number | null;
  name: string | null;
  email: string | null;
  totpRequired: boolean;
  challengeToken: string | null;
}

export interface ForgotPasswordResponse {
  message: string;
}

/** Error answered by the API; `code` identifies special cases (e.g. "email_not_verified"). */
export class ApiResponseError extends Error {
  readonly status: number;
  readonly code?: string;
  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiResponseError";
    this.status = status;
    this.code = code;
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const body = data as Record<string, string>;
    throw new ApiResponseError(
      body.error ?? Object.values(body)[0] ?? "Unexpected error",
      res.status,
      body.code,
    );
  }
  return data as T;
}

export async function apiLogin(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${env.apiUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse<LoginResponse>(res);
}

export async function apiLoginTotp(challengeToken: string, code: string): Promise<LoginResponse> {
  const res = await fetch(`${env.apiUrl}/auth/login/totp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ challengeToken, code }),
  });
  return handleResponse<LoginResponse>(res);
}

export async function apiRegister(name: string, email: string, password: string): Promise<void> {
  const res = await fetch(`${env.apiUrl}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  await handleResponse<unknown>(res);
}

export async function apiGoogleLogin(credential: string): Promise<LoginResponse> {
  const res = await fetch(`${env.apiUrl}/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ credential }),
  });
  return handleResponse<LoginResponse>(res);
}

export async function apiForgotPassword(email: string): Promise<ForgotPasswordResponse> {
  const res = await fetch(`${env.apiUrl}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return handleResponse<ForgotPasswordResponse>(res);
}

export async function apiResetPassword(token: string, newPassword: string): Promise<void> {
  const res = await fetch(`${env.apiUrl}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, newPassword }),
  });
  await handleResponse<unknown>(res);
}

export async function apiVerifyEmail(token: string): Promise<void> {
  const res = await fetch(`${env.apiUrl}/auth/verify-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  await handleResponse<unknown>(res);
}

export async function apiResendVerification(email: string): Promise<void> {
  const res = await fetch(`${env.apiUrl}/auth/resend-verification`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  await handleResponse<unknown>(res);
}
