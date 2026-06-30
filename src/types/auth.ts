/** Account origin: created with a password or via Google. */
export type AuthProvider = "password" | "google";

/** Public representation of the user (no sensitive data). */
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  provider: AuthProvider;
}

/** Authenticated session persisted in localStorage. */
export interface AuthSession {
  token: string;
  user: User;
}
