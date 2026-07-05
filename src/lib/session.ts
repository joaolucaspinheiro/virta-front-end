import type { AuthSession } from "@/types/auth";

/** localStorage key holding the authenticated session. */
export const SESSION_KEY = "virta.session";

/** Reads the persisted session, or null when absent/corrupted. */
export function getStoredSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as AuthSession) : null;
  } catch {
    return null;
  }
}

/** Convenience getter for the access token used on authenticated requests. */
export function getStoredToken(): string | null {
  return getStoredSession()?.token ?? null;
}
