import { env } from "@/config/env";
import { getStoredToken } from "@/lib/session";
import type { TransactionType } from "@/types/transaction";

export interface ReportFilters {
  /** "YYYY-MM" */
  from: string;
  /** "YYYY-MM" */
  to: string;
  categoryIds: number[];
  type?: TransactionType;
}

/**
 * Downloads the statement (CSV) for the filters. A plain <a href> can't send the
 * JWT, so we fetch the file with the header and hand it to the browser as a Blob.
 */
export async function downloadStatement(walletId: number, filters: ReportFilters): Promise<void> {
  const params = new URLSearchParams({ from: filters.from, to: filters.to });
  filters.categoryIds.forEach((id) => params.append("categoryIds", String(id)));
  if (filters.type) params.set("type", filters.type);

  const res = await fetch(
    `${env.apiUrl}/api/v1/wallets/${walletId}/reports/statement?${params}`,
    { headers: { Authorization: `Bearer ${getStoredToken()}` } },
  );
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as Record<string, string>;
    throw new Error(body.error ?? "Não foi possível gerar o relatório.");
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download =
    filters.from === filters.to
      ? `extrato-${filters.from}.csv`
      : `extrato-${filters.from}_a_${filters.to}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
