import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AuthSession, User } from "@/types/auth";

const STORAGE_KEY = "virta.session";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  /** Kept for compatibility; the session is read synchronously. */
  isLoading: boolean;
  setSession: (session: AuthSession) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthSession) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Read the persisted session at init (synchronous) — no effect, no render cascade.
  const [session, setSessionState] = useState<AuthSession | null>(readSession);

  const value = useMemo<AuthContextValue>(() => {
    const setSession = (next: AuthSession) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setSessionState(next);
    };

    const logout = () => {
      localStorage.removeItem(STORAGE_KEY);
      setSessionState(null);
    };

    return {
      user: session?.user ?? null,
      token: session?.token ?? null,
      isAuthenticated: session !== null,
      isLoading: false,
      setSession,
      logout,
    };
  }, [session, session?.token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an <AuthProvider>.");
  }
  return ctx;
}
