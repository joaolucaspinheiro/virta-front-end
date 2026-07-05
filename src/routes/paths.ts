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
  wallets: "/app/carteiras",
  /** Pattern used in the route definition (with :id). */
  walletDetail: "/app/carteiras/:id",
  /** Helper to build the concrete URL with a wallet id. */
  walletDetailTo: (id: number | string) => `/app/carteiras/${id}`,
  profile: "/app/perfil",
  changePassword: "/app/perfil/senha",
} as const;
