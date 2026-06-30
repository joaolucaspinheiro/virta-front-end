import type { User } from "@/types/auth";

/**
 * Fake "database" kept in localStorage, used only by the change-password mock
 * until that backend endpoint exists. Real auth (login/register/google/recovery)
 * already goes through the Spring API.
 */

const USERS_KEY = "virta.mock.users";

/** User as stored in the mock — includes the password (simulation only). */
export interface StoredUser extends User {
  password?: string;
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export const mockDb = {
  findById(id: string): StoredUser | undefined {
    return read<StoredUser[]>(USERS_KEY, []).find((u) => u.id === id);
  },

  upsert(user: StoredUser): StoredUser {
    const users = read<StoredUser[]>(USERS_KEY, []);
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx >= 0) users[idx] = user;
    else users.push(user);
    write(USERS_KEY, users);
    return user;
  },
};
