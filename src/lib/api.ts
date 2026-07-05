export interface LoginResponse {
  token: string;
  id: number;
  name: string;
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
  debugToken?: string | null;
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as Record<string, string>).error ?? "Unexpected error");
  }
  return data as T;
}

export async function apiLogin(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse<LoginResponse>(res);
}

export async function apiRegister(name: string, email: string, password: string): Promise<void> {
  const res = await fetch("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  await handleResponse<unknown>(res);
}

export async function apiGoogleLogin(credential: string): Promise<LoginResponse> {
  const res = await fetch("/auth/google", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ credential }),
  });
  return handleResponse<LoginResponse>(res);
}

export async function apiForgotPassword(email: string): Promise<ForgotPasswordResponse> {
  const res = await fetch("/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return handleResponse<ForgotPasswordResponse>(res);
}

export async function apiResetPassword(token: string, newPassword: string): Promise<void> {
  const res = await fetch("/auth/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, newPassword }),
  });
  await handleResponse<unknown>(res);
}
