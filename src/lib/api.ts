export interface LoginResponse {
  token: string;
  id: number;
  nome: string;
  email: string;
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as Record<string, string>).erro ?? "Erro inesperado");
  }
  return data as T;
}

export async function apiLogin(email: string, senha: string): Promise<LoginResponse> {
  const res = await fetch("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha  }),
  });
  return handleResponse<LoginResponse>(res);
}

export async function apiRegister(nome: string, email: string, senha: string): Promise<void> {
  const res = await fetch("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email, senha }),
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
