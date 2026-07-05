import { apiFetch } from "@/lib/http";
import type { Wallet, WalletMember, WalletRole } from "@/types/wallet";

const BASE = "/api/v1/wallets";

export interface WalletInput {
  name: string;
  description?: string;
}

export function listWallets(): Promise<Wallet[]> {
  return apiFetch<Wallet[]>(BASE);
}

export function getWallet(id: number): Promise<Wallet> {
  return apiFetch<Wallet>(`${BASE}/${id}`);
}

export function createWallet(input: WalletInput): Promise<Wallet> {
  return apiFetch<Wallet>(BASE, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateWallet(id: number, input: WalletInput): Promise<Wallet> {
  return apiFetch<Wallet>(`${BASE}/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export function deleteWallet(id: number): Promise<void> {
  return apiFetch<void>(`${BASE}/${id}`, { method: "DELETE" });
}

export function listMembers(walletId: number): Promise<WalletMember[]> {
  return apiFetch<WalletMember[]>(`${BASE}/${walletId}/members`);
}

export function addMember(
  walletId: number,
  input: { email: string; role: WalletRole },
): Promise<WalletMember> {
  return apiFetch<WalletMember>(`${BASE}/${walletId}/members`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateMemberRole(
  walletId: number,
  userId: number,
  role: WalletRole,
): Promise<WalletMember> {
  return apiFetch<WalletMember>(`${BASE}/${walletId}/members/${userId}`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });
}

export function removeMember(walletId: number, userId: number): Promise<void> {
  return apiFetch<void>(`${BASE}/${walletId}/members/${userId}`, {
    method: "DELETE",
  });
}
