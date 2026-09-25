import { apiFetch } from "@/lib/http";
import type {
  DashboardSummary,
  Transaction,
  TransactionInput,
  TransactionType,
} from "@/types/transaction";
import {getStoredToken} from "@/lib/session";

const base = (walletId: number) => `/api/v1/wallets/${walletId}/transactions`;


export function subscribeToWalletEvents(walletId: number, onChange: () => void): () => void {
  const controller = new AbortController();
  (async () => {
    try{
      const res = await fetch(`${base(walletId)}/events`, {
        headers: {Authorization: `Bearer ${getStoredToken()}` },
        signal: controller.signal,
      });
      if(!res.ok || !res.body) return;
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while(true){
        const {value, done} = await reader.read();
        if(done) break;
        if(decoder.decode(value).includes("transaction-changed")){
          onChange();
        }
      }
    } catch{
//abort
    }
  })();
  return () => controller.abort();
}

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
