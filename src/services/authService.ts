import type { AuthSession } from "@/types/auth";
import { mockDb } from "@/services/mockDb";
import {
  apiForgotPassword,
  apiGoogleLogin,
  apiLogin,
  apiRegister,
  apiResetPassword,
} from "@/lib/api";

/**
 * Authentication service layer.
 *
 * login/register/google/forgot/reset: call the real Spring backend (via @/lib/api + proxy).
 * change password: still mocked (the endpoint does not exist yet at this stage).
 * Each function throws an AuthError carrying an i18n key (or the backend message)
 * so the UI can show the proper text.
 */

const DEFAULT_DELAY = 800;
const delay = (ms = DEFAULT_DELAY) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/** Authentication business error. `messageKey` is an i18n key. */
export class AuthError extends Error {
  readonly messageKey: string;
  constructor(messageKey: string) {
    super(messageKey);
    this.name = "AuthError";
    this.messageKey = messageKey;
  }
}

/**
 * Converts fetch errors into AuthError. A network failure becomes a translatable
 * key; backend errors (with a message) pass the message through (i18n returns the
 * raw text when it is not a known key).
 */
function toAuthError(err: unknown): AuthError {
  if (err instanceof TypeError) {
    return new AuthError("auth.errors.server_unreachable");
  }
  if (err instanceof Error && err.message) {
    return new AuthError(err.message);
  }
  return new AuthError("login.messages.generic_error");
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export async function login(input: LoginInput): Promise<AuthSession> {
  try {
    const data = await apiLogin(input.email, input.password);
    return {
      token: data.token,
      user: {
        id: String(data.id),
        name: data.name,
        email: data.email,
        provider: "password",
      },
    };
  } catch (err) {
    throw toAuthError(err);
  }
}

export async function register(input: RegisterInput): Promise<AuthSession> {
  try {
    await apiRegister(input.name.trim(), input.email.trim(), input.password);
    // The register endpoint does not return a token; log in right after.
    return await login({ email: input.email, password: input.password });
  } catch (err) {
    throw toAuthError(err);
  }
}

/**
 * Google login. Sends the Google Identity Services ID token (credential) to the
 * backend, which validates the signature and returns our own JWT.
 */
export async function loginWithGoogle(credential: string): Promise<AuthSession> {
  try {
    const data = await apiGoogleLogin(credential);
    return {
      token: data.token,
      user: {
        id: String(data.id),
        name: data.name,
        email: data.email,
        provider: "google",
      },
    };
  } catch (err) {
    throw toAuthError(err);
  }
}

/**
 * Recovery step 1. The UI message stays neutral; the backend returns a debugToken
 * (test helper) only when the e-mail exists.
 */
export async function forgotPassword(
  email: string,
): Promise<{ debugToken?: string }> {
  try {
    const data = await apiForgotPassword(email);
    return { debugToken: data.debugToken ?? undefined };
  } catch (err) {
    throw toAuthError(err);
  }
}

/** Recovery step 2. Sends the token and the new password to the backend. */
export async function resetPassword(
  token: string,
  newPassword: string,
): Promise<void> {
  try {
    await apiResetPassword(token, newPassword);
  } catch (err) {
    throw toAuthError(err);
  }
}

/**
 * Change password (mock). The backend does not expose this endpoint yet.
 * For users coming from the real backend (absent from the mock store), we just
 * simulate success, since there is no way to verify the current password here.
 */
export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  await delay();
  const user = mockDb.findById(userId);
  if (user) {
    if (user.provider === "password" && user.password !== currentPassword) {
      throw new AuthError("auth.errors.wrong_current_password");
    }
    user.password = newPassword;
    user.provider = "password";
    mockDb.upsert(user);
  }
}
