import { apiFetch } from "@/lib/http";
import type {
  DashboardSummary,
  Transaction,
  TransactionInput,
  TransactionType,
} from "@/types/transaction";

const base = (walletId: number) => `/api/v1/wallets/${walletId}/transactions`;

export function listTransactions(
  walletId: number,
  type?: TransactionType,
): Promise<Transaction[]> {
  const query = type ? `?type=${type}` : "";
  return apiFetch<Transaction[]>(`${base(walletId)}${query}`);
}

export function createTransaction(
  walletId: number,
  input: TransactionInput,
): Promise<Transaction> {
  return apiFetch<Transaction>(base(walletId), {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateTransaction(
  walletId: number,
  id: number,
  input: TransactionInput,
): Promise<Transaction> {
  return apiFetch<Transaction>(`${base(walletId)}/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export function deleteTransaction(
  walletId: number,
  id: number,
): Promise<void> {
  return apiFetch<void>(`${base(walletId)}/${id}`, { method: "DELETE" });
}

export function getSummary(walletId: number): Promise<DashboardSummary> {
  return apiFetch<DashboardSummary>(`/api/v1/wallets/${walletId}/summary`);
}
