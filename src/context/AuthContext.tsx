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
  /** Mantido por compatibilidade; a sessão é lida de forma síncrona. */
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
  // Lê a sessão persistida já no init (síncrono) — sem effect, sem cascata de render.
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
  }, [session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth deve ser usado dentro de <AuthProvider>.");
  }
  return ctx;
}
