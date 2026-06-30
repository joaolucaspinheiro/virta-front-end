/** Password strength rules, shared across sign-up, reset and change password. */
export interface PasswordRule {
  /** i18n key for the rule description. */
  key: string;
  test: (password: string) => boolean;
}

export const passwordRules: PasswordRule[] = [
  { key: "login.validation.req_length", test: (p) => p.length >= 8 },
  { key: "login.validation.req_upper", test: (p) => /[A-Z]/.test(p) },
  { key: "login.validation.req_lower", test: (p) => /[a-z]/.test(p) },
  { key: "login.validation.req_number", test: (p) => /\d/.test(p) },
  { key: "login.validation.req_special", test: (p) => /[@$!%*?&#]/.test(p) },
];

/** Does the password satisfy every rule? */
export function isStrongPassword(password: string): boolean {
  return passwordRules.every((rule) => rule.test(password));
}

/** How many rules the password satisfies (0..passwordRules.length). */
export function passwordScore(password: string): number {
  return passwordRules.filter((rule) => rule.test(password)).length;
}
