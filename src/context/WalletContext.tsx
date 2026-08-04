import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { listWallets } from "@/services/walletService";
import type { Wallet } from "@/types/wallet";
import { useAuth } from "@/context/AuthContext";

const STORAGE_KEY = "virta.selectedWalletId";

interface WalletContextValue {
  wallets: Wallet[];
  selectedWallet: Wallet | null;
  loading: boolean;
  selectWallet: (id: number) => void;
  /** Reload the wallet list (after create/delete) keeping a valid selection. */
  reloadWallets: () => Promise<void>;
}

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? Number(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  const reloadWallets = useCallback(async () => {
    const ws = await listWallets();
    setWallets(ws);
    setSelectedId((prev) =>
      prev && ws.some((w) => w.id === prev)
        ? prev
        : ws.length > 0
          ? ws[0].id
          : null,
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    void reloadWallets();
  }, [isAuthenticated, reloadWallets]);

  const selectWallet = useCallback((id: number) => {
    setSelectedId(id);
    localStorage.setItem(STORAGE_KEY, String(id));
  }, []);

  useEffect(() => {
    if (selectedId != null) localStorage.setItem(STORAGE_KEY, String(selectedId));
  }, [selectedId]);

  const value = useMemo<WalletContextValue>(() => {
    const selectedWallet = wallets.find((w) => w.id === selectedId) ?? null;
    return { wallets, selectedWallet, loading, selectWallet, reloadWallets };
  }, [wallets, selectedId, loading, selectWallet, reloadWallets]);

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWallet(): WalletContextValue {
  const ctx = useContext(WalletContext);
  if (!ctx) {
    throw new Error("useWallet must be used within a <WalletProvider>.");
  }
  return ctx;
}
