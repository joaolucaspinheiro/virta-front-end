import { getStoredToken } from "@/lib/session";

/** Error carrying the HTTP status alongside the backend message. */
export class ApiError extends Error {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * Authenticated fetch wrapper for the `/api` endpoints. Attaches the Bearer
 * token from the stored session, parses JSON and normalizes errors.
 */
export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getStoredToken();
  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  // 204 No Content (e.g. DELETE) has no body to parse.
  if (res.status === 204) {
    return undefined as T;
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const body = data as Record<string, string>;
    throw new ApiError(
        body.error ?? Object.values(body)[0] ?? "Unexpected error",
        res.status,
    );
  }
  return data as T;
}
