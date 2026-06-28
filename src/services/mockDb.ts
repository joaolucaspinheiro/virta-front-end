import type { User } from "@/types/auth";

/**
 * "Banco" fake guardado no localStorage para a Parte 1 (sem backend real).
 * Na Parte 2 estas funções serão substituídas por chamadas HTTP ao Spring.
 */

const USERS_KEY = "virta.mock.users";
const TOKENS_KEY = "virta.mock.resetTokens";

/** Usuário como guardado no mock — inclui a senha (apenas para simulação). */
export interface StoredUser extends User {
  password?: string;
}

interface ResetToken {
  email: string;
  expiresAt: number;
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
  findByEmail(email: string): StoredUser | undefined {
    return read<StoredUser[]>(USERS_KEY, []).find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );
  },

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

  saveToken(token: string, data: ResetToken): void {
    const tokens = read<Record<string, ResetToken>>(TOKENS_KEY, {});
    tokens[token] = data;
    write(TOKENS_KEY, tokens);
  },

  consumeToken(token: string): ResetToken | undefined {
    const tokens = read<Record<string, ResetToken>>(TOKENS_KEY, {});
    const data = tokens[token];
    if (data) {
      delete tokens[token];
      write(TOKENS_KEY, tokens);
    }
    return data;
  },
};
