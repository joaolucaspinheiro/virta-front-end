import { apiFetch } from "@/lib/http";

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  photo: string | null;
  createdAt: string;
  /** Two-step verification (TOTP) is on. */
  totpEnabled: boolean;
}

export interface TotpSetup {
  /** For typing into the authenticator app by hand. */
  secret: string;
  /** Content of the QR code. */
  otpauthUri: string;
}

export interface TotpEnabled {
  message: string;
  /** Shown only once: the user must save them. */
  recoveryCodes: string[];
}

const ME = "/api/v1/users/me";

export function getMe(): Promise<UserProfile> {
  return apiFetch<UserProfile>(ME);
}

export function updateProfile(name: string): Promise<UserProfile> {
  return apiFetch<UserProfile>(ME, {
    method: "PUT",
    body: JSON.stringify({ name }),
  });
}

export function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  return apiFetch<void>(`${ME}/password`, {
    method: "PATCH",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

/** Two-step verification, step 1: a new secret (not active until a code is confirmed). */
export function setupTotp(): Promise<TotpSetup> {
  return apiFetch<TotpSetup>(`${ME}/totp/setup`, { method: "POST" });
}

/** Two-step verification, step 2: confirms a code, turns it on and returns the recovery codes. */
export function enableTotp(code: string): Promise<TotpEnabled> {
  return apiFetch<TotpEnabled>(`${ME}/totp/enable`, {
    method: "POST",
    body: JSON.stringify({ code }),
  });
}

/** Turns two-step verification off (asks for a code or a recovery code). */
export function disableTotp(code: string): Promise<void> {
  return apiFetch<void>(`${ME}/totp/disable`, {
    method: "POST",
    body: JSON.stringify({ code }),
  });
}
