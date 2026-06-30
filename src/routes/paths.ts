/** Application routes, centralized to avoid scattered string literals. */
export const paths = {
  login: "/login",
  register: "/cadastro",
  forgotPassword: "/recuperar-senha",
  /** Pattern used in the route definition (with :token). */
  resetPassword: "/redefinir-senha/:token",
  /** Helper to build the concrete URL with a token. */
  resetPasswordTo: (token: string) => `/redefinir-senha/${token}`,
  app: "/app",
  dashboard: "/app/dashboard",
  changePassword: "/app/perfil/senha",
} as const;
