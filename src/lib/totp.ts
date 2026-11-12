/**
 * Keeps only what each mode accepts while the user types:
 * - app code: digits only, at most 6 ("123456");
 * - recovery code: letters/digits, uppercase, dash added after 4 ("K7QM-2XPA").
 */
export function sanitizeTotpInput(value: string, recovery: boolean): string {
  if (!recovery) {
    return value.replace(/\D/g, "").slice(0, 6);
  }
  const clean = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
  return clean.length > 4 ? `${clean.slice(0, 4)}-${clean.slice(4)}` : clean;
}

/** True when the value has the full format of the current mode. */
export function isCompleteTotpInput(value: string, recovery: boolean): boolean {
  return recovery ? /^[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(value) : /^\d{6}$/.test(value);
}
