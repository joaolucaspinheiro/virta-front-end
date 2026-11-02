import { apiFetch } from "@/lib/http";
import type {
  DashboardSummary,
  Transaction,
  TransactionInput,
  TransactionType,
} from "@/types/transaction";
import {getStoredToken} from "@/lib/session";
import { env } from "@/config/env";

const base = (walletId: number) => `/api/v1/wallets/${walletId}/transactions`;


export function subscribeToWalletEvents(walletId: number, onChange: () => void): () => void {
  const controller = new AbortController();
  (async () => {
    try{
      const res = await fetch(`${env.apiUrl}${base(walletId)}/events`, {
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

/** Optional filters for the summary. Missing/empty values mean "everything". */
export interface SummaryFilters {
  /** ISO dates, e.g. "2026-11-01". Only applied when both are present. */
  startDate?: string;
  endDate?: string;
  categoryIds?: number[];
  type?: TransactionType;
}

export function getSummary(
  walletId: number,
  filters: SummaryFilters = {},
): Promise<DashboardSummary> {
  const params = new URLSearchParams();
  if (filters.startDate && filters.endDate) {
    params.set("startDate", filters.startDate);
    params.set("endDate", filters.endDate);
  }
  filters.categoryIds?.forEach((id) => params.append("categoryIds", String(id)));
  if (filters.type) params.set("type", filters.type);
  const qs = params.toString();
  const query = qs ? `?${qs}` : "";
  return apiFetch<DashboardSummary>(`/api/v1/wallets/${walletId}/summary${query}`);
}
