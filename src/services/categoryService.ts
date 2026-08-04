import { apiFetch } from "@/lib/http";
import type { Category } from "@/types/category";
import type { TransactionType } from "@/types/transaction";

const BASE = "/api/v1/categories";

export interface CategoryInput {
  name: string;
  type: TransactionType;
  color?: string;
  icon?: string;
}

export function listCategories(type?: TransactionType): Promise<Category[]> {
  const query = type ? `?type=${type}` : "";
  return apiFetch<Category[]>(`${BASE}${query}`);
}

export function createCategory(input: CategoryInput): Promise<Category> {
  return apiFetch<Category>(BASE, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateCategory(
  id: number,
  input: CategoryInput,
): Promise<Category> {
  return apiFetch<Category>(`${BASE}/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export function deleteCategory(id: number): Promise<void> {
  return apiFetch<void>(`${BASE}/${id}`, { method: "DELETE" });
}
