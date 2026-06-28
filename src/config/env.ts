/**
 * Acesso centralizado às variáveis de ambiente do front-end.
 * Tudo que é exposto ao navegador precisa do prefixo VITE_ (regra do Vite).
 */
export const env = {
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "",
};

/** True quando há um Client ID configurado para habilitar o login com Google. */
export const isGoogleEnabled = env.googleClientId.length > 0;
