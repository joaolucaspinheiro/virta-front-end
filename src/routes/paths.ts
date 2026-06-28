/** Rotas da aplicação, centralizadas para evitar strings soltas. */
export const paths = {
  login: "/login",
  register: "/cadastro",
  forgotPassword: "/recuperar-senha",
  /** Padrão usado na definição da rota (com :token). */
  resetPassword: "/redefinir-senha/:token",
  /** Helper para montar a URL concreta com um token. */
  resetPasswordTo: (token: string) => `/redefinir-senha/${token}`,
  app: "/app",
  dashboard: "/app/dashboard",
  changePassword: "/app/perfil/senha",
} as const;
