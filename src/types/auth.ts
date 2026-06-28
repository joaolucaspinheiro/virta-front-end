/** Origem da conta: criada com senha ou via Google. */
export type AuthProvider = "password" | "google";

/** Representação pública do usuário (sem dados sensíveis). */
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  provider: AuthProvider;
}

/** Sessão autenticada persistida no localStorage. */
export interface AuthSession {
  token: string;
  user: User;
}
