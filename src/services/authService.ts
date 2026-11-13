import type { AuthProvider, AuthSession } from "@/types/auth";
import {
  apiForgotPassword,
  apiGoogleLogin,
  apiLogin,
  apiLoginTotp,
  apiRegister,
  apiResendVerification,
  apiResetPassword,
  apiVerifyEmail,
  ApiResponseError,
  type LoginResponse,
} from "@/lib/api";

/**
 * Authentication service layer. Every function calls the real Spring backend
 * (via @/lib/api + the Vite proxy) and throws an AuthError carrying an i18n key
 * (or the backend message) so the UI can show the proper text.
 */

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

/** Right password, but the e-mail was never confirmed: the UI offers to resend the link. */
export class EmailNotVerifiedError extends AuthError {
  readonly email: string;
  constructor(email: string) {
    super("login.verify.not_verified");
    this.name = "EmailNotVerifiedError";
    this.email = email;
  }
}

/** Thrown by login() when the account has two-step verification: the UI then asks for the code. */
export class TotpRequiredError extends Error {
  readonly challengeToken: string;
  constructor(challengeToken: string) {
    super("totp_required");
    this.name = "TotpRequiredError";
    this.challengeToken = challengeToken;
  }
}

/** Builds the session from a successful login answer; refuses an answer without a token. */
function toSession(data: LoginResponse, provider: AuthProvider): AuthSession {
  if (!data.token || data.id == null || !data.name || !data.email) {
    throw new AuthError("login.messages.generic_error");
  }
  return {
    token: data.token,
    user: { id: String(data.id), name: data.name, email: data.email, provider },
  };
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
  let data: LoginResponse;
  try {
    data = await apiLogin(input.email, input.password);
  } catch (err) {
    if (err instanceof ApiResponseError && err.code === "email_not_verified") {
      throw new EmailNotVerifiedError(input.email);
    }
    throw toAuthError(err);
  }
  if (data.totpRequired && data.challengeToken) {
    throw new TotpRequiredError(data.challengeToken);
  }
  return toSession(data, "password");
}

/** Login step 2: the challenge from step 1 + the 6-digit code (or a recovery code). */
export async function loginWithTotp(challengeToken: string, code: string): Promise<AuthSession> {
  try {
    return toSession(await apiLoginTotp(challengeToken, code), "password");
  } catch (err) {
    throw toAuthError(err);
  }
}

/**
 * Creates the account. It starts inactive: the back-end e-mails a confirmation link,
 * so there is no automatic login here.
 */
export async function register(input: RegisterInput): Promise<void> {
  try {
    await apiRegister(input.name.trim(), input.email.trim(), input.password);
  } catch (err) {
    throw toAuthError(err);
  }
}

/** Opens the confirmation link (activates the account). */
export async function verifyEmail(token: string): Promise<void> {
  try {
    await apiVerifyEmail(token);
  } catch (err) {
    throw toAuthError(err);
  }
}

/** Sends a new confirmation link. The answer is neutral (doesn't reveal if the e-mail exists). */
export async function resendVerification(email: string): Promise<void> {
  try {
    await apiResendVerification(email.trim());
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
    return toSession(await apiGoogleLogin(credential), "google");
  } catch (err) {
    throw toAuthError(err);
  }
}

/**
 * Recovery step 1. The UI message stays neutral; the reset link is sent by
 * e-mail, only when the e-mail exists.
 */
export async function forgotPassword(
  email: string,
): Promise<void> {
  try {
    await apiForgotPassword(email);
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
