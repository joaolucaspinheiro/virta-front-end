export type TransactionType = "INCOME" | "EXPENSE";

export interface Transaction {
  id: number;
  type: TransactionType;
  amount: number;
  description: string | null;
  /** Effective date of the transaction, ISO date, e.g. "2025-01-15". */
  date: string;
  categoryId: number | null;
  categoryName: string | null;
  categoryColor: string | null;
  createdByName: string;
  createdAt: string;
}

export interface TransactionInput {
  type: TransactionType;
  amount: number;
  description?: string;
  date: string;
  categoryId?: number;
}

/** ----- Dashboard summary ----- */

export interface CategorySummary {
  categoryId: number;
  categoryName: string;
  categoryColor: string | null;
  total: number;
}

export interface MonthSummary {
  /** "YYYY-MM" */
  month: string;
  income: number;
  expense: number;
}

export interface DashboardSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
  byCategory: CategorySummary[];
  byMonth: MonthSummary[];
}
