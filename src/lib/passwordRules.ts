/** Regras de força de senha, compartilhadas entre cadastro, redefinição e troca. */
export interface PasswordRule {
  /** Chave i18n da descrição da regra. */
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

/** A senha cumpre todas as regras? */
export function isStrongPassword(password: string): boolean {
  return passwordRules.every((rule) => rule.test(password));
}

/** Quantas regras a senha cumpre (0..passwordRules.length). */
export function passwordScore(password: string): number {
  return passwordRules.filter((rule) => rule.test(password)).length;
}
