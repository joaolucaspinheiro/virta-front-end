import type { TransactionType } from "@/types/transaction";

export interface Category {
  id: number;
  name: string;
  type: TransactionType;
  color: string | null;
  icon: string | null;
}
